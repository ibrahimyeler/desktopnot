package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "strconv"
    "time"
)

// API URLs
const YAHOO_FINANCE_BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart"
const ALPHA_VANTAGE_API_KEY = "CGW59PNGKD9CG81X"
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"

func fetchRealStockData() []Stock {
    symbols := []string{"AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX"}
    var stocks []Stock
    
    log.Printf("Fetching data for %d symbols", len(symbols))
    
    // API rate limit aşıldığında mock data kullan
    if len(stocks) == 0 {
        log.Printf("API rate limit exceeded, using mock data")
        return getMockStockData()
    }
    
    for _, symbol := range symbols {
        log.Printf("Fetching data for symbol: %s", symbol)
        stock := fetchStockFromAPI(symbol)
        if stock.Symbol != "" {
            stocks = append(stocks, stock)
            log.Printf("Successfully fetched data for %s", symbol)
        } else {
            log.Printf("Failed to fetch data for %s", symbol)
        }
        // API rate limit için bekle
        time.Sleep(100 * time.Millisecond)
    }
    
    log.Printf("Total stocks fetched: %d", len(stocks))
    
    // Eğer hiç veri alınamadıysa mock data kullan
    if len(stocks) == 0 {
        log.Printf("No data fetched from APIs, using mock data")
        return getMockStockData()
    }
    
    return stocks
}

func fetchStockBySymbol(symbol string) Stock {
    stock := fetchStockFromAPI(symbol)
    if stock.Symbol == "" {
        // Mock data'dan bul
        mockStocks := getMockStockData()
        for _, mockStock := range mockStocks {
            if mockStock.Symbol == symbol {
                return mockStock
            }
        }
    }
    return stock
}

func fetchStockFromAPI(symbol string) Stock {
    // Önce Yahoo Finance API ile dene
    yahooStock := fetchYahooFinanceData(symbol)
    if yahooStock.Symbol != "" {
        return yahooStock
    }
    
    // Eğer Yahoo Finance başarısız olursa, Alpha Vantage ile dene
    quoteStock := fetchGlobalQuote(symbol)
    if quoteStock.Symbol != "" {
        return quoteStock
    }
    
    // Son çare olarak TIME_SERIES_DAILY ile dene
    return fetchTimeSeriesDaily(symbol)
}

func fetchYahooFinanceData(symbol string) Stock {
    url := fmt.Sprintf("%s/%s?interval=1d&range=1d", YAHOO_FINANCE_BASE_URL, symbol)
    
    log.Printf("Fetching Yahoo Finance data for %s from: %s", symbol, url)
    
    resp, err := http.Get(url)
    if err != nil {
        log.Printf("Error fetching Yahoo Finance data for %s: %v", symbol, err)
        return Stock{}
    }
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    
    log.Printf("Yahoo Finance response for %s: %s", symbol, string(body))
    
    var result map[string]interface{}
    json.Unmarshal(body, &result)
    
    // Yahoo Finance response'unu parse et
    if chart, exists := result["chart"].(map[string]interface{}); exists {
        if result, exists := chart["result"].([]interface{}); exists && len(result) > 0 {
            if firstResult, ok := result[0].(map[string]interface{}); ok {
                if meta, exists := firstResult["meta"].(map[string]interface{}); exists {
                    price := meta["regularMarketPrice"].(float64)
                    
                    // Önceki günün fiyatını al
                    var previousPrice float64
                    if indicators, exists := firstResult["indicators"].(map[string]interface{}); exists {
                        if quote, exists := indicators["quote"].([]interface{}); exists && len(quote) > 0 {
                            if quoteData, ok := quote[0].(map[string]interface{}); ok {
                                if close, exists := quoteData["close"].([]interface{}); exists && len(close) > 1 {
                                    if prev, ok := close[len(close)-2].(float64); ok {
                                        previousPrice = prev
                                    }
                                }
                            }
                        }
                    }
                    
                    change := price - previousPrice
                    changePercent := (change / previousPrice) * 100
                    
                    // Volume bilgisini al
                    var volume int64
                    if indicators, exists := firstResult["indicators"].(map[string]interface{}); exists {
                        if quote, exists := indicators["quote"].([]interface{}); exists && len(quote) > 0 {
                            if quoteData, ok := quote[0].(map[string]interface{}); ok {
                                if volumes, exists := quoteData["volume"].([]interface{}); exists && len(volumes) > 0 {
                                    if vol, ok := volumes[len(volumes)-1].(float64); ok {
                                        volume = int64(vol)
                                    }
                                }
                            }
                        }
                    }
                    
                    log.Printf("Found Yahoo Finance data for %s", symbol)
                    return Stock{
                        Symbol:        symbol,
                        Name:          getCompanyName(symbol),
                        Price:         price,
                        Change:        change,
                        ChangePercent: changePercent,
                        Volume:        volume,
                        MarketCap:     price * float64(volume), // Basit hesaplama
                        AIPrediction:  calculateAIPrediction(changePercent),
                        Confidence:    calculateConfidence(changePercent),
                        LastUpdated:   time.Now().Format(time.RFC3339),
                        Sector:        getSector(symbol),
                        Industry:      getIndustry(symbol),
                    }
                }
            }
        }
    }
    
    log.Printf("No Yahoo Finance data found for %s", symbol)
    return Stock{}
}

func fetchGlobalQuote(symbol string) Stock {
    url := fmt.Sprintf("%s?function=GLOBAL_QUOTE&symbol=%s&apikey=%s", 
        ALPHA_VANTAGE_BASE_URL, symbol, ALPHA_VANTAGE_API_KEY)
    
    log.Printf("Fetching GLOBAL_QUOTE for %s from: %s", symbol, url)
    
    resp, err := http.Get(url)
    if err != nil {
        log.Printf("Error fetching GLOBAL_QUOTE for %s: %v", symbol, err)
        return Stock{}
    }
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    
    log.Printf("GLOBAL_QUOTE response for %s: %s", symbol, string(body))
    
    var result map[string]interface{}
    json.Unmarshal(body, &result)
    
    // API response'unu parse et
    if quote, exists := result["Global Quote"].(map[string]interface{}); exists {
        log.Printf("Found Global Quote data for %s", symbol)
        price := parseFloat(quote["05. price"].(string))
        change := parseFloat(quote["09. change"].(string))
        changePercent := parseFloat(quote["10. change percent"].(string))
        volume := parseInt64(quote["06. volume"].(string))
        
        return Stock{
            Symbol:        symbol,
            Name:          getCompanyName(symbol),
            Price:         price,
            Change:        change,
            ChangePercent: changePercent,
            Volume:        volume,
            MarketCap:     price * float64(volume), // Basit hesaplama
            AIPrediction:  calculateAIPrediction(changePercent),
            Confidence:    calculateConfidence(changePercent),
            LastUpdated:   time.Now().Format(time.RFC3339),
            Sector:        getSector(symbol),
            Industry:      getIndustry(symbol),
        }
    }
    
    log.Printf("No Global Quote data found for %s", symbol)
    return Stock{}
}

func fetchTimeSeriesDaily(symbol string) Stock {
    url := fmt.Sprintf("%s?function=TIME_SERIES_DAILY&symbol=%s&outputsize=compact&apikey=%s", 
        ALPHA_VANTAGE_BASE_URL, symbol, ALPHA_VANTAGE_API_KEY)
    
    resp, err := http.Get(url)
    if err != nil {
        return Stock{}
    }
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    
    var result map[string]interface{}
    json.Unmarshal(body, &result)
    
    // API response'unu parse et
    if timeSeries, exists := result["Time Series (Daily)"].(map[string]interface{}); exists {
        // En son tarihi bul
        var latestDate string
        for date := range timeSeries {
            if latestDate == "" || date > latestDate {
                latestDate = date
            }
        }
        
        if latestDate != "" {
            if dailyData, exists := timeSeries[latestDate].(map[string]interface{}); exists {
                price := parseFloat(dailyData["4. close"].(string))
                open := parseFloat(dailyData["1. open"].(string))
                change := price - open
                changePercent := (change / open) * 100
                volume := parseInt64(dailyData["5. volume"].(string))
                
                return Stock{
                    Symbol:        symbol,
                    Name:          getCompanyName(symbol),
                    Price:         price,
                    Change:        change,
                    ChangePercent: changePercent,
                    Volume:        volume,
                    MarketCap:     price * float64(volume), // Basit hesaplama
                    AIPrediction:  calculateAIPrediction(changePercent),
                    Confidence:    calculateConfidence(changePercent),
                    LastUpdated:   time.Now().Format(time.RFC3339),
                    Sector:        getSector(symbol),
                    Industry:      getIndustry(symbol),
                }
            }
        }
    }
    
    return Stock{}
}

// Helper functions
func parseFloat(s string) float64 {
    f, _ := strconv.ParseFloat(s, 64)
    return f
}

func parseInt64(s string) int64 {
    i, _ := strconv.ParseInt(s, 10, 64)
    return i
}

func getCompanyName(symbol string) string {
    names := map[string]string{
        "AAPL": "Apple Inc.",
        "MSFT": "Microsoft Corporation",
        "GOOGL": "Alphabet Inc.",
        "AMZN": "Amazon.com Inc.",
        "TSLA": "Tesla Inc.",
        "NVDA": "NVIDIA Corporation",
        "META": "Meta Platforms Inc.",
        "NFLX": "Netflix Inc.",
    }
    return names[symbol]
}

func getSector(symbol string) string {
    sectors := map[string]string{
        "AAPL": "Technology",
        "MSFT": "Technology",
        "GOOGL": "Technology",
        "AMZN": "Consumer Cyclical",
        "TSLA": "Consumer Cyclical",
        "NVDA": "Technology",
        "META": "Technology",
        "NFLX": "Communication Services",
    }
    return sectors[symbol]
}

func getIndustry(symbol string) string {
    industries := map[string]string{
        "AAPL": "Consumer Electronics",
        "MSFT": "Software",
        "GOOGL": "Internet Content & Information",
        "AMZN": "Internet Retail",
        "TSLA": "Auto Manufacturers",
        "NVDA": "Semiconductors",
        "META": "Internet Content & Information",
        "NFLX": "Entertainment",
    }
    return industries[symbol]
}

func calculateAIPrediction(changePercent float64) string {
    if changePercent > 2.0 {
        return "Strong Buy"
    } else if changePercent > 0.5 {
        return "Buy"
    } else if changePercent > -0.5 {
        return "Hold"
    } else if changePercent > -2.0 {
        return "Sell"
    } else {
        return "Strong Sell"
    }
}

func calculateConfidence(changePercent float64) int {
    confidence := int(50 + (changePercent * 10))
    if confidence > 100 {
        confidence = 100
    } else if confidence < 0 {
        confidence = 0
    }
    return confidence
}

// Search functionality
type SearchResult struct {
    Symbol      string `json:"symbol"`
    Name        string `json:"name"`
    Type        string `json:"type"`
    Region      string `json:"region"`
    MarketOpen  string `json:"marketOpen"`
    MarketClose string `json:"marketClose"`
    Timezone    string `json:"timezone"`
    Currency    string `json:"currency"`
    MatchScore  string `json:"matchScore"`
}

func searchStocksByKeyword(keyword string) []SearchResult {
    url := fmt.Sprintf("%s?function=SYMBOL_SEARCH&keywords=%s&apikey=%s", 
        ALPHA_VANTAGE_BASE_URL, keyword, ALPHA_VANTAGE_API_KEY)
    
    resp, err := http.Get(url)
    if err != nil {
        return []SearchResult{}
    }
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    
    var result map[string]interface{}
    json.Unmarshal(body, &result)
    
    var results []SearchResult
    
    if matches, exists := result["bestMatches"].([]interface{}); exists {
        for _, match := range matches {
            if matchData, ok := match.(map[string]interface{}); ok {
                result := SearchResult{
                    Symbol:      matchData["1. symbol"].(string),
                    Name:        matchData["2. name"].(string),
                    Type:        matchData["3. type"].(string),
                    Region:      matchData["4. region"].(string),
                    MarketOpen:  matchData["5. marketOpen"].(string),
                    MarketClose: matchData["6. marketClose"].(string),
                    Timezone:    matchData["7. timezone"].(string),
                    Currency:    matchData["8. currency"].(string),
                    MatchScore:  matchData["9. matchScore"].(string),
                }
                results = append(results, result)
            }
        }
    }
    
    return results
}

// Market status functionality
type MarketStatus struct {
    Markets []MarketInfo `json:"markets"`
}

type MarketInfo struct {
    MarketType string `json:"marketType"`
    Region     string `json:"region"`
    PrimaryExchanges string `json:"primaryExchanges"`
    LocalOpen  string `json:"localOpen"`
    LocalClose string `json:"localClose"`
    CurrentStatus string `json:"currentStatus"`
    Notes      string `json:"notes"`
}

func getGlobalMarketStatus() MarketStatus {
    url := fmt.Sprintf("%s?function=MARKET_STATUS&apikey=%s", 
        ALPHA_VANTAGE_BASE_URL, ALPHA_VANTAGE_API_KEY)
    
    resp, err := http.Get(url)
    if err != nil {
        return MarketStatus{}
    }
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    
    var result map[string]interface{}
    json.Unmarshal(body, &result)
    
    var markets []MarketInfo
    
    if marketData, exists := result["markets"].(map[string]interface{}); exists {
        for marketType, marketInfo := range marketData {
            if info, ok := marketInfo.(map[string]interface{}); ok {
                market := MarketInfo{
                    MarketType: marketType,
                    Region:     info["region"].(string),
                    PrimaryExchanges: info["primaryExchanges"].(string),
                    LocalOpen:  info["localOpen"].(string),
                    LocalClose: info["localClose"].(string),
                    CurrentStatus: info["currentStatus"].(string),
                    Notes:      info["notes"].(string),
                }
                markets = append(markets, market)
            }
        }
    }
    
    return MarketStatus{Markets: markets}
}

// Mock data for testing when APIs are rate limited
func getMockStockData() []Stock {
    return []Stock{
        {
            Symbol:        "AAPL",
            Name:          "Apple Inc.",
            Price:         232.56,
            Change:        2.07,
            ChangePercent: 0.90,
            Volume:        38074700,
            MarketCap:     8854652232,
            AIPrediction:  "Buy",
            Confidence:    59,
            LastUpdated:   time.Now().Format(time.RFC3339),
            Sector:        "Technology",
            Industry:      "Consumer Electronics",
        },
        {
            Symbol:        "MSFT",
            Name:          "Microsoft Corporation",
            Price:         509.64,
            Change:        2.90,
            ChangePercent: 0.57,
            Volume:        18015593,
            MarketCap:     9181466816,
            AIPrediction:  "Buy",
            Confidence:    55,
            LastUpdated:   time.Now().Format(time.RFC3339),
            Sector:        "Technology",
            Industry:      "Software",
        },
        {
            Symbol:        "GOOGL",
            Name:          "Alphabet Inc.",
            Price:         211.64,
            Change:        4.16,
            ChangePercent: 2.01,
            Volume:        32339307,
            MarketCap:     6844290933,
            AIPrediction:  "Strong Buy",
            Confidence:    70,
            LastUpdated:   time.Now().Format(time.RFC3339),
            Sector:        "Technology",
            Industry:      "Internet Content & Information",
        },
        {
            Symbol:        "AMZN",
            Name:          "Amazon.com Inc.",
            Price:         231.60,
            Change:        2.48,
            ChangePercent: 1.08,
            Volume:        33679585,
            MarketCap:     7800191886,
            AIPrediction:  "Buy",
            Confidence:    60,
            LastUpdated:   time.Now().Format(time.RFC3339),
            Sector:        "Consumer Cyclical",
            Industry:      "Internet Retail",
        },
        {
            Symbol:        "TSLA",
            Name:          "Tesla Inc.",
            Price:         345.98,
            Change:        -3.62,
            ChangePercent: -1.04,
            Volume:        67903224,
            MarketCap:     23493157439,
            AIPrediction:  "Sell",
            Confidence:    39,
            LastUpdated:   time.Now().Format(time.RFC3339),
            Sector:        "Consumer Cyclical",
            Industry:      "Auto Manufacturers",
        },
        {
            Symbol:        "NVDA",
            Name:          "NVIDIA Corporation",
            Price:         180.17,
            Change:        -1.43,
            ChangePercent: -0.79,
            Volume:        281787824,
            MarketCap:     50769712250,
            AIPrediction:  "Sell",
            Confidence:    42,
            LastUpdated:   time.Now().Format(time.RFC3339),
            Sector:        "Technology",
            Industry:      "Semiconductors",
        },
        {
            Symbol:        "META",
            Name:          "Meta Platforms Inc.",
            Price:         751.11,
            Change:        3.73,
            ChangePercent: 0.50,
            Volume:        7467955,
            MarketCap:     5609255680,
            AIPrediction:  "Hold",
            Confidence:    55,
            LastUpdated:   time.Now().Format(time.RFC3339),
            Sector:        "Technology",
            Industry:      "Internet Content & Information",
        },
        {
            Symbol:        "NFLX",
            Name:          "Netflix Inc.",
            Price:         1231.45,
            Change:        7.95,
            ChangePercent: 0.65,
            Volume:        1950336,
            MarketCap:     2401741267,
            AIPrediction:  "Buy",
            Confidence:    56,
            LastUpdated:   time.Now().Format(time.RFC3339),
            Sector:        "Communication Services",
            Industry:      "Entertainment",
        },
    }
}

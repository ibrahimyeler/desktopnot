package main

import (
    "log"
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

type Stock struct {
    Symbol        string  `json:"symbol"`
    Name          string  `json:"name"`
    Price         float64 `json:"price"`
    Change        float64 `json:"change"`
    ChangePercent float64 `json:"changePercent"`
    Volume        int64   `json:"volume"`
    MarketCap     float64 `json:"marketCap"`
    AIPrediction  string  `json:"aiPrediction"`
    Confidence    int     `json:"confidence"`
    LastUpdated   string  `json:"lastUpdated"`
    Sector        string  `json:"sector"`
    Industry      string  `json:"industry"`
}

func main() {
    r := gin.Default()
    
    // CORS ayarları
    r.Use(cors.Default())
    
    // API routes
    r.GET("/api/stocks", getAllStocks)
    r.GET("/api/stocks/:symbol", getStockBySymbol)
    r.GET("/api/search/:keyword", searchStocks)
    r.GET("/api/market-status", getMarketStatus)
    
    log.Fatal(r.Run(":8080"))
}

func getAllStocks(c *gin.Context) {
    // Gerçek veri kaynağından veri çek
    stocks := fetchRealStockData()
    
    c.JSON(http.StatusOK, stocks)
}

func getStockBySymbol(c *gin.Context) {
    symbol := c.Param("symbol")
    stock := fetchStockBySymbol(symbol)
    
    c.JSON(http.StatusOK, stock)
}

func searchStocks(c *gin.Context) {
    keyword := c.Param("keyword")
    results := searchStocksByKeyword(keyword)
    
    c.JSON(http.StatusOK, results)
}

func getMarketStatus(c *gin.Context) {
    status := getGlobalMarketStatus()
    
    c.JSON(http.StatusOK, status)
}

import requests
import pandas as pd
from lxml import etree
from bs4 import BeautifulSoup

URL = "https://www.dekorbizden.com/TicimaxXmlV2/9C5CEEAF4CE84D639313285CCAACF3DC/"

xml_data = requests.get(URL, timeout=60).content
root = etree.XML(xml_data)

rows = []

for urun in root.xpath("//Urun"):

    base_data = {
        "UrunKartiID": urun.findtext("UrunKartiID"),
        "UrunAdi": urun.findtext("UrunAdi"),
        "Marka": urun.findtext("Marka"),
        "Kategori": urun.findtext("Kategori"),
        "KategoriTree": urun.findtext("KategoriTree"),
        "UrunUrl": urun.findtext("UrunUrl"),
        "OzelAlan1": urun.findtext("OzelAlan1"),
        "SeoBaslik": urun.findtext("SeoSayfaBaslik"),
        "SeoKeywords": urun.findtext("SeoAnahtarKelime"),
        "SeoAciklama": urun.findtext("SeoAciklama"),
    }

    onyazi_html = urun.findtext("OnYazi") or ""
    aciklama_html = urun.findtext("Aciklama") or ""

    base_data["OnYazi"] = BeautifulSoup(onyazi_html, "html.parser").get_text(" ", strip=True)
    base_data["Aciklama"] = BeautifulSoup(aciklama_html, "html.parser").get_text(" ", strip=True)

    # ✅ TEKNİK DETAYLAR → DİNAMİK KOLON
    teknik = {}
    for t in urun.xpath(".//TeknikDetay"):
        key = t.findtext("OzellikTanim")
        val = t.findtext("DegerTanim")
        teknik[key] = val

    # ✅ VARYANTLAR AYRI SATIR
    for secenek in urun.xpath(".//UrunSecenek/Secenek"):

        row = base_data.copy()

        row["VaryasyonID"] = secenek.findtext("VaryasyonID")
        row["StokKodu"] = secenek.findtext("StokKodu")
        row["Stok"] = secenek.findtext("StokAdedi")
        row["AlisFiyati"] = secenek.findtext("AlisFiyati")
        row["SatisFiyati"] = secenek.findtext("SatisFiyati")
        row["IndirimliFiyat"] = secenek.findtext("IndirimliFiyat")
        row["ParaBirimi"] = secenek.findtext("ParaBirimiKodu")

        # ✅ VARYANT ÖZELLİĞİ
        ozellik = secenek.find(".//Ozellik")
        if ozellik is not None:
            row["VaryantTip"] = ozellik.get("Tanim")
            row["VaryantDeger"] = ozellik.text
        else:
            row["VaryantTip"] = ""
            row["VaryantDeger"] = ""

        # ✅ RESİMLER (tek hücre)
        resimler = [r.text for r in secenek.xpath(".//Resim")]
        row["Resimler"] = ",".join(resimler)

        # ✅ TEKNİK DETAYLARI SATIRA EKLE
        for k, v in teknik.items():
            row[k] = v

        rows.append(row)

# ✅ EXCEL OLUŞTUR
df = pd.DataFrame(rows)
df.to_excel("urunler.xlsx", index=False)

print("✅ urunler.xlsx BAŞARIYLA OLUŞTURULDU")

const stocks = [
  {
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    sector: 'Technology',
    exchange: 'NASDAQ',
    price: 211.34,
    changePercent: 1.24,
    marketCap: '3.24T',
    volume: 58420000,
    analystRating: 'Buy',
    logo: 'A',
    description:
      'Apple designs consumer electronics, software, and services across iPhone, Mac, wearables, and digital subscriptions.',
  },
  {
    ticker: 'TSLA',
    companyName: 'Tesla Inc.',
    sector: 'Consumer Cyclical',
    exchange: 'NASDAQ',
    price: 184.88,
    changePercent: -0.72,
    marketCap: '589.5B',
    volume: 78240000,
    analystRating: 'Hold',
    logo: 'T',
    description:
      'Tesla builds electric vehicles, energy storage products, charging infrastructure, and autonomous driving technology.',
  },
  {
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    sector: 'Technology',
    exchange: 'NASDAQ',
    price: 132.76,
    changePercent: 2.92,
    marketCap: '3.27T',
    volume: 312900000,
    analystRating: 'Strong Buy',
    logo: 'N',
    description:
      'NVIDIA is a leader in accelerated computing, GPUs, AI infrastructure, gaming, data centers, and visualization platforms.',
  },
  {
    ticker: 'MSFT',
    companyName: 'Microsoft Corporation',
    sector: 'Technology',
    exchange: 'NASDAQ',
    price: 428.16,
    changePercent: 0.84,
    marketCap: '3.18T',
    volume: 21480000,
    analystRating: 'Strong Buy',
    logo: 'M',
    description:
      'Microsoft provides cloud computing, productivity software, operating systems, gaming, AI services, and enterprise platforms.',
  },
  {
    ticker: 'AMZN',
    companyName: 'Amazon.com Inc.',
    sector: 'Consumer Cyclical',
    exchange: 'NASDAQ',
    price: 187.42,
    changePercent: 1.78,
    marketCap: '1.95T',
    volume: 39860000,
    analystRating: 'Buy',
    logo: 'Z',
    description:
      'Amazon operates ecommerce marketplaces, logistics networks, cloud infrastructure through AWS, advertising, and media services.',
  },
  {
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    sector: 'Communication Services',
    exchange: 'NASDAQ',
    price: 174.39,
    changePercent: -0.31,
    marketCap: '2.13T',
    volume: 28610000,
    analystRating: 'Buy',
    logo: 'G',
    description:
      'Alphabet operates Google Search, YouTube, Android, cloud services, advertising technology, and emerging AI businesses.',
  },
  {
    ticker: 'META',
    companyName: 'Meta Platforms Inc.',
    sector: 'Communication Services',
    exchange: 'NASDAQ',
    price: 485.58,
    changePercent: 1.16,
    marketCap: '1.23T',
    volume: 14930000,
    analystRating: 'Buy',
    logo: 'M',
    description:
      'Meta operates social platforms, messaging products, advertising systems, and long-term investments in AI and immersive computing.',
  },
  {
    ticker: 'NFLX',
    companyName: 'Netflix Inc.',
    sector: 'Communication Services',
    exchange: 'NASDAQ',
    price: 642.19,
    changePercent: 0.42,
    marketCap: '276.9B',
    volume: 3510000,
    analystRating: 'Buy',
    logo: 'N',
    description:
      'Netflix is a global streaming entertainment company with subscription video, original content production, and advertising tiers.',
  },
  {
    ticker: 'AMD',
    companyName: 'Advanced Micro Devices Inc.',
    sector: 'Technology',
    exchange: 'NASDAQ',
    price: 158.91,
    changePercent: 2.18,
    marketCap: '256.8B',
    volume: 50270000,
    analystRating: 'Buy',
    logo: 'A',
    description:
      'AMD designs high-performance CPUs, GPUs, adaptive computing products, and AI accelerators for client, gaming, and data center markets.',
  },
  {
    ticker: 'AVGO',
    companyName: 'Broadcom Inc.',
    sector: 'Technology',
    exchange: 'NASDAQ',
    price: 1412.73,
    changePercent: 1.37,
    marketCap: '657.4B',
    volume: 2810000,
    analystRating: 'Buy',
    logo: 'B',
    description:
      'Broadcom supplies semiconductor and infrastructure software products across networking, broadband, wireless, storage, and enterprise markets.',
  },
  {
    ticker: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    sector: 'Financial Services',
    exchange: 'NYSE',
    price: 199.82,
    changePercent: 0.58,
    marketCap: '574.2B',
    volume: 8720000,
    analystRating: 'Buy',
    logo: 'J',
    description:
      'JPMorgan Chase is a diversified financial services firm spanning investment banking, consumer banking, markets, payments, and asset management.',
  },
  {
    ticker: 'V',
    companyName: 'Visa Inc.',
    sector: 'Financial Services',
    exchange: 'NYSE',
    price: 275.96,
    changePercent: -0.22,
    marketCap: '548.7B',
    volume: 6210000,
    analystRating: 'Buy',
    logo: 'V',
    description:
      'Visa operates one of the world’s largest digital payments networks, connecting consumers, merchants, financial institutions, and governments.',
  },
  {
    ticker: 'MA',
    companyName: 'Mastercard Inc.',
    sector: 'Financial Services',
    exchange: 'NYSE',
    price: 456.64,
    changePercent: 0.73,
    marketCap: '424.1B',
    volume: 2580000,
    analystRating: 'Buy',
    logo: 'M',
    description:
      'Mastercard provides global payment processing, transaction routing, fraud prevention, and data services for digital commerce.',
  },
  {
    ticker: 'UNH',
    companyName: 'UnitedHealth Group Inc.',
    sector: 'Healthcare',
    exchange: 'NYSE',
    price: 512.48,
    changePercent: -0.48,
    marketCap: '471.5B',
    volume: 3410000,
    analystRating: 'Buy',
    logo: 'U',
    description:
      'UnitedHealth Group provides health benefits, care delivery, pharmacy services, and healthcare technology through UnitedHealthcare and Optum.',
  },
  {
    ticker: 'LLY',
    companyName: 'Eli Lilly and Company',
    sector: 'Healthcare',
    exchange: 'NYSE',
    price: 807.43,
    changePercent: 1.91,
    marketCap: '767.1B',
    volume: 3120000,
    analystRating: 'Strong Buy',
    logo: 'L',
    description:
      'Eli Lilly develops medicines across diabetes, obesity, oncology, immunology, neuroscience, and cardiometabolic care.',
  },
  {
    ticker: 'XOM',
    companyName: 'Exxon Mobil Corporation',
    sector: 'Energy',
    exchange: 'NYSE',
    price: 113.27,
    changePercent: -0.61,
    marketCap: '501.2B',
    volume: 15190000,
    analystRating: 'Hold',
    logo: 'X',
    description:
      'Exxon Mobil is an integrated energy company with upstream production, refining, chemicals, low-carbon investments, and global operations.',
  },
  {
    ticker: 'KO',
    companyName: 'The Coca-Cola Company',
    sector: 'Consumer Defensive',
    exchange: 'NYSE',
    price: 62.74,
    changePercent: 0.18,
    marketCap: '270.3B',
    volume: 13240000,
    analystRating: 'Hold',
    logo: 'C',
    description:
      'Coca-Cola owns and markets beverage brands across sparkling drinks, water, sports drinks, coffee, tea, and juices worldwide.',
  },
  {
    ticker: 'COST',
    companyName: 'Costco Wholesale Corporation',
    sector: 'Consumer Defensive',
    exchange: 'NASDAQ',
    price: 846.33,
    changePercent: 0.96,
    marketCap: '375.2B',
    volume: 1740000,
    analystRating: 'Buy',
    logo: 'C',
    description:
      'Costco operates membership warehouses focused on high-volume retail, private-label products, consumer staples, and discretionary categories.',
  },
  {
    ticker: 'SPY',
    companyName: 'SPDR S&P 500 ETF Trust',
    sector: 'ETF',
    exchange: 'NYSE Arca',
    price: 534.12,
    changePercent: 0.64,
    marketCap: '499.8B',
    volume: 62850000,
    analystRating: 'Index',
    logo: 'S',
    description:
      'SPY is an exchange-traded fund designed to track the performance of the S&P 500 Index.',
  },
  {
    ticker: 'QQQ',
    companyName: 'Invesco QQQ Trust',
    sector: 'ETF',
    exchange: 'NASDAQ',
    price: 462.85,
    changePercent: 1.04,
    marketCap: '281.6B',
    volume: 42470000,
    analystRating: 'Index',
    logo: 'Q',
    description:
      'QQQ tracks the Nasdaq-100 Index, offering exposure to large non-financial companies listed on Nasdaq.',
  },
  {
    ticker: 'RELIANCE',
    companyName: 'Reliance Industries Ltd.',
    sector: 'Energy',
    exchange: 'NSE',
    price: 2918.75,
    changePercent: 0.81,
    marketCap: '19.74T INR',
    volume: 6840000,
    analystRating: 'Buy',
    logo: 'R',
    description:
      'Reliance Industries operates across energy, petrochemicals, retail, telecom, digital services, media, and new energy initiatives.',
  },
  {
    ticker: 'TCS',
    companyName: 'Tata Consultancy Services Ltd.',
    sector: 'Technology',
    exchange: 'NSE',
    price: 3847.2,
    changePercent: -0.36,
    marketCap: '13.91T INR',
    volume: 2460000,
    analystRating: 'Hold',
    logo: 'T',
    description:
      'TCS provides IT services, consulting, cloud transformation, enterprise software, analytics, and managed services globally.',
  },
  {
    ticker: 'INFY',
    companyName: 'Infosys Ltd.',
    sector: 'Technology',
    exchange: 'NSE',
    price: 1469.55,
    changePercent: 0.52,
    marketCap: '6.09T INR',
    volume: 5150000,
    analystRating: 'Buy',
    logo: 'I',
    description:
      'Infosys provides digital services, consulting, cloud engineering, AI, automation, and enterprise technology modernization.',
  },
  {
    ticker: 'HDFCBANK',
    companyName: 'HDFC Bank Ltd.',
    sector: 'Financial Services',
    exchange: 'NSE',
    price: 1512.8,
    changePercent: -0.28,
    marketCap: '11.56T INR',
    volume: 18320000,
    analystRating: 'Buy',
    logo: 'H',
    description:
      'HDFC Bank is a leading Indian private-sector bank offering retail banking, wholesale banking, payments, lending, and treasury services.',
  },
  {
    ticker: 'ICICIBANK',
    companyName: 'ICICI Bank Ltd.',
    sector: 'Financial Services',
    exchange: 'NSE',
    price: 1124.6,
    changePercent: 0.67,
    marketCap: '7.92T INR',
    volume: 14650000,
    analystRating: 'Buy',
    logo: 'I',
    description:
      'ICICI Bank provides banking, lending, payments, investment, insurance distribution, and treasury services across India and overseas.',
  },
]

const marketIndexes = [
  { name: 'S&P 500', ticker: 'SPX', price: 5376.44, changePercent: 0.66 },
  { name: 'NASDAQ', ticker: 'IXIC', price: 17192.53, changePercent: 1.11 },
  { name: 'NIFTY', ticker: 'NIFTY', price: 22988.15, changePercent: -0.18 },
  { name: 'Dow Jones', ticker: 'DJI', price: 39069.59, changePercent: 0.32 },
]

function createHistory(ticker, range = '1M') {
  const stock = stocks.find((stock) => stock.ticker === ticker)
  const base = stock?.price || 100
  const points = { '1D': 24, '1W': 7, '1M': 30, '3M': 60, '6M': 90, '1Y': 120, '5Y': 160 }[range] || 30
  const seed = ticker.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const volatility = stock?.sector === 'ETF' ? 0.006 : stock?.sector === 'Technology' ? 0.018 : 0.012
  const trend = ((stock?.changePercent || 0) / 100) * base
  let close = base * (1 - volatility * points)

  return Array.from({ length: points }, (_, index) => {
    const cycle = Math.sin((index + seed) / 5) * base * volatility
    const secondaryCycle = Math.cos((index + seed) / 13) * base * volatility * 0.45
    const drift = (index / Math.max(points - 1, 1)) * trend * 3.5
    close = Math.max(2, base + drift + cycle + secondaryCycle)
    const open = close * (1 - Math.sin(index + seed) * volatility * 0.45)
    const high = Math.max(open, close) * (1 + volatility * 0.55)
    const low = Math.min(open, close) * (1 - volatility * 0.5)
    const volumeBase = stock?.volume || 3000000
    const volume = Math.round(volumeBase * (0.74 + Math.abs(Math.sin(index + seed)) * 0.58))
    const ma50 = close * (0.992 + Math.sin(index / 9) * 0.004)
    const ma200 = close * (0.968 + Math.cos(index / 17) * 0.004)

    return {
      label: range === '1D' ? `${String(index).padStart(2, '0')}:00` : `D${index + 1}`,
      price: Number(close.toFixed(2)),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume,
      ma50: Number(ma50.toFixed(2)),
      ma200: Number(ma200.toFixed(2)),
      rsi: Number((46 + Math.sin(index / 4) * 18).toFixed(2)),
      macd: Number((Math.sin(index / 6) * 3.2).toFixed(2)),
      upperBand: Number((close * 1.035).toFixed(2)),
      lowerBand: Number((close * 0.965).toFixed(2)),
    }
  })
}

function enrichStock(stock) {
  return {
    ...stock,
    history: createHistory(stock.ticker, '1M').slice(-12),
  }
}

module.exports = { stocks, marketIndexes, createHistory, enrichStock }

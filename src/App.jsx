import { useState, useCallback } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import PropTypes from "prop-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import "./App.css";

const initialData = [
  {
    ticker: "AAPL",
    country: "USA",
    exchange: "NASDAQ",
    asset: "Stock",
    name: "Apple Inc.",
  },
  {
    ticker: "TSLA",
    country: "USA",
    exchange: "NASDAQ",
    asset: "Stock",
    name: "Tesla Inc.",
  },
  {
    ticker: "SPY",
    country: "USA",
    exchange: "NYSE",
    asset: "ETF",
    name: "SPDR S&P 500 ETF Trust",
  },
  {
    ticker: "BTC-USD",
    country: "Global",
    exchange: "Crypto",
    asset: "Cryptocurrency",
    name: "Bitcoin",
  },
  {
    ticker: "GLD",
    country: "USA",
    exchange: "NYSE",
    asset: "ETF",
    name: "SPDR Gold Trust",
  },
  {
    ticker: "GOOGL",
    country: "USA",
    exchange: "NASDAQ",
    asset: "Stock",
    name: "Alphabet Inc.",
  },
  {
    ticker: "US10Y",
    country: "USA",
    exchange: "Treasury",
    asset: "Bond",
    name: "US 10-Year Treasury Note",
  },
  {
    ticker: "WTI",
    country: "Global",
    exchange: "Commodities",
    asset: "Commodity",
    name: "West Texas Intermediate Crude Oil",
  },
  {
    ticker: "EUR/USD",
    country: "Global",
    exchange: "Forex",
    asset: "Currency Pair",
    name: "Euro to US Dollar",
  },
  {
    ticker: "AMZN",
    country: "USA",
    exchange: "NASDAQ",
    asset: "Stock",
    name: "Amazon.com Inc.",
  },
];

const ResultItem = ({ symbol, name, exchange }) => (
  <div className="flex flex-row text-xs p-2 hover:bg-gray-50 transition-colors cursor-pointer">
    <div className="flex-none w-12 text-blue-500 font-medium underline">
      {/* data is compromised to trim for sanity sake */}
      {String(symbol).replace(/-/, "").substring(0, 4)}
    </div>
    <div className="flex-1 text-gray-900">
      <span className="line-clamp-1">{name}</span>
    </div>
    <div className="flex-none w-10 text-gray-600 text-right">{exchange}</div>
  </div>
);
ResultItem.propTypes = {
  symbol: PropTypes.string,
  name: PropTypes.string,
  exchange: PropTypes.string,
};

const fnMap = (data) => ({
  symbol: data?.symbol || data?.ticker,
  name: data.name,
  exchange: data?.exchange || "NYSE",
});
const fnFilter = (data) => (data?.symbol ? true : false);

const useSearch = (q = "") => {
  let url = `https://ticker-2e1ica8b9.now.sh/keyword/${q}`;
  return useQuery({
    enabled: q.length > 1,
    staleTime: 10000, // 10 second cache time for demo purposes
    queryKey: [q],
    queryFn: () => fetch(url).then((res) => res.json()),
    placeholderData: keepPreviousData,
  });
};

function App() {
  const [search, setSearch] = useState("");
  const [focus, setFocus] = useState(false);
  const debouncedSearchTerm = useDebounce(search, 300);
  const { error, data, isFetching } = useSearch(debouncedSearchTerm);
  const handleChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  if (error) return "An error has occurred: " + error.message;

  return (
    <header className="flex justify-end">
      <div className="w-96 py-1 mr-6 mt-6">
        <div className="relative bg-[rgb(213,213,213)]/50 border-[#a5a5a5] border rounded-md p-3 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="relative">
            <div className="absolute mt-2 ml-2">
              <svg width="10" height="11" viewBox="0 0 10 11" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.21406 8.14061C2.24843 8.14061 0.655004 6.575 0.655004 4.64062C0.655004 2.70625 2.24843 1.13751 4.21406 1.13751C6.17968 1.13751 7.77344 2.70625 7.77344 4.64062C7.77344 6.575 6.17968 8.14061 4.21406 8.14061ZM9.91031 9.95312L7.32937 7.4125C8.00499 6.67812 8.42032 5.70937 8.42032 4.64062C8.42032 2.35312 6.53718 0.5 4.21406 0.5C1.89093 0.5 0.0078125 2.35312 0.0078125 4.64062C0.0078125 6.925 1.89093 8.77812 4.21406 8.77812C5.21781 8.77812 6.13844 8.43126 6.86156 7.85313L9.45281 10.4031C9.57937 10.5281 9.78406 10.5281 9.91031 10.4031C10.0369 10.2812 10.0369 10.0781 9.91031 9.95312Z"
                  fill="black"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              className="flex h-6 w-[330px] rounded-md border-[#a5a5a5] border border-input bg-background pl-6 pr-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground outline-none md:text-sm"
              placeholder="Search Ticker"
              onChange={handleChange}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              value={search}
            />
            {isFetching && (
              <div className="absolute right-11 top-1 bg-white">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <div className="absolute right-3 top-4">
            <svg width="15" height="15" viewBox="0 0 11 11" fill="none">
              <path
                opacity="0.5"
                d="M1.04297 7.5C1.04297 6.78965 1.04319 6.26843 1.09237 5.8694C1.14123 5.47292 1.23657 5.21611 1.41284 5.02381C1.58769 4.83307 1.81889 4.73117 2.17736 4.6786C2.54062 4.62531 3.01594 4.625 3.66797 4.625H7.33464C7.98666 4.625 8.46197 4.62531 8.82523 4.6786C9.1837 4.73117 9.4149 4.83307 9.58975 5.02382C9.76603 5.21612 9.86137 5.47292 9.91023 5.8694C9.95941 6.26843 9.95963 6.78965 9.95963 7.5C9.95963 8.21035 9.95941 8.73157 9.91023 9.1306C9.86137 9.52708 9.76603 9.78388 9.58975 9.97618C9.4149 10.1669 9.1837 10.2688 8.82523 10.3214C8.46197 10.3747 7.98666 10.375 7.33464 10.375H3.66797C3.01594 10.375 2.54062 10.3747 2.17736 10.3214C1.81889 10.2688 1.58769 10.1669 1.41284 9.97619C1.23657 9.78389 1.14123 9.52708 1.09237 9.1306C1.04319 8.73157 1.04297 8.21035 1.04297 7.5Z"
                fill="#5BB0FF"
                stroke="black"
                strokeWidth="0.25"
              ></path>
              <path
                d="M3.09375 3.5C3.09375 2.05025 4.17107 0.875 5.5 0.875C6.82894 0.875 7.90625 2.05025 7.90625 3.5V4.5018C8.16631 4.50445 8.39369 4.511 8.59375 4.5273V3.5C8.59375 1.63604 7.20862 0.125 5.5 0.125C3.79137 0.125 2.40625 1.63604 2.40625 3.5V4.5273C2.60632 4.511 2.83371 4.50445 3.09375 4.5018V3.5Z"
                fill="#323232"
              ></path>
              <text
                x="5.5"
                y="9.5"
                textAnchor="middle"
                fontSize="5px"
                fontWeight="bold"
                fill="black"
              >
                1
              </text>
            </svg>
          </div>
          <div>
            {/* Recent Tickers Section */}
            {focus && search.length < 2 && (
              <div>
                <h2 className="text-xs font-medium text-gray-600 mt-3 mb-2">
                  Recent Tickers
                </h2>
                <div className="bg-white max-h-[166px] overflow-scroll rounded-lg divide-y border border-gray-100">
                  {initialData
                    .map(fnMap)
                    .filter(fnFilter)
                    .map(({ symbol, name, exchange }) => (
                      <ResultItem
                        key={`recent-${symbol}-${name}`}
                        symbol={symbol}
                        exchange={exchange}
                        name={name}
                      />
                    ))}
                </div>
              </div>
            )}
            {/* Popular Tickers Section */}
            {focus && search.length < 2 && (
              <div>
                <h2 className="text-xs font-medium text-gray-600 mt-3 mb-2">
                  Popular Tickers
                </h2>
                <div className="bg-white max-h-[166px] overflow-scroll rounded-lg divide-y border border-gray-100">
                  {initialData
                    .map(fnMap)
                    .filter(fnFilter)
                    .map(({ symbol, exchange, name }) => (
                      <ResultItem
                        key={`popular-${symbol}-${name}`}
                        symbol={symbol}
                        exchange={exchange}
                        name={name}
                      />
                    ))}
                </div>
              </div>
            )}
            {/* Initial Data Section */}
            {Array.isArray(data) && search.length > 1 && (
              <div>
                <h2 className="text-xs font-medium text-gray-600 mt-3 mb-2">
                  All Tickers
                </h2>
                <div className="bg-white max-h-[332px] overflow-scroll rounded-lg divide-y border border-gray-100">
                  {data
                    .map(fnMap)
                    .filter(fnFilter)
                    .map(({ symbol, name, exchange }) => (
                      <ResultItem
                        key={`recent-${symbol}-${name}`}
                        symbol={symbol}
                        exchange={exchange}
                        name={name}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiArrowUpRight, FiArrowDownRight, FiDollarSign, FiGlobe } from 'react-icons/fi';

const MARKETS = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', type: 'CRYPTO' },
    { symbol: 'ETHUSDT', name: 'Ethereum', type: 'CRYPTO' },
    { symbol: 'PAXGUSDT', name: 'Gold (Pax)', type: 'COMMODITY' },
    { symbol: 'BNBUSDT', name: 'Binance', type: 'CRYPTO' },
];

// Simulated Indian Indices (since no public free real-time API easily available without key)
const SIMULATED_INDICES = [
    { name: 'NIFTY 50', price: 24142.50, change: 0.45 },
    { name: 'SENSEX', price: 79845.20, change: 0.32 },
    { name: 'BANK NIFTY', price: 52450.80, change: -0.12 },
];

const StockWidget = () => {
    const [stocks, setStocks] = useState([]);
    const [indices, setIndices] = useState(SIMULATED_INDICES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const promises = MARKETS.map(m =>
                    axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${m.symbol}`)
                );
                const results = await Promise.all(promises);
                const stockData = results.map((r, i) => ({
                    ...r.data,
                    name: MARKETS[i].name,
                    type: MARKETS[i].type
                }));
                setStocks(stockData);
                setLoading(false);
            } catch (err) {
                console.error("Stock Fetch Error", err);
                setLoading(false);
            }
        };

        fetchStocks();
        const interval = setInterval(fetchStocks, 10000); // 10s updates for crypto

        // Simulate minor updates for indices
        const indexInterval = setInterval(() => {
            setIndices(prev => prev.map(idx => ({
                ...idx,
                price: idx.price * (1 + (Math.random() * 0.001 - 0.0005))
            })));
        }, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(indexInterval);
        };
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Ticker Tape */}
            <div className="overflow-hidden bg-slate-900 border-y border-white/5 py-2 -mx-6 lg:rounded-xl lg:mx-0 lg:border lg:shadow-inner">
                <motion.div
                    className="flex items-center gap-8 whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                >
                    {[...indices, ...indices, ...indices].map((idx, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                            <span>{idx.name}</span>
                            <span className={idx.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {idx.price.toFixed(2)}
                            </span>
                            <span className={`text-[8px] px-1 py-0.5 rounded ${idx.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {idx.change > 0 ? '+' : ''}{idx.change}%
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                layout
                className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <FiActivity className="text-green-400 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-bold">Market Watch</h3>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Global Assets</p>
                        </div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                        <FiGlobe className="text-white/40" />
                    </div>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="py-12 flex justify-center text-white/30 text-xs font-bold uppercase tracking-widest">Loading Markets...</div>
                    ) : (
                        stocks.map((stock, index) => {
                            const isPositive = parseFloat(stock.priceChangePercent) >= 0;
                            return (
                                <motion.div
                                    key={stock.symbol}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            $
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-bold">{stock.name}</p>
                                            <p className="text-white/40 text-[10px] font-bold uppercase">{stock.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white text-sm font-black tracking-wide">
                                            ${parseFloat(stock.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <div className={`flex items-center justify-end gap-1 text-[10px] font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                            {isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                                            <span>{Math.abs(parseFloat(stock.priceChangePercent)).toFixed(2)}%</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                    <p className="text-[9px] text-white/30 uppercase font-black">Powered by Binance Public Data</p>
                    <button className="text-[10px] text-green-400 font-bold uppercase tracking-widest hover:text-green-300 transition-colors">
                        View Portfolio
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default StockWidget;

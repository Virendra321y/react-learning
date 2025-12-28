import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiActivity, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

const StockWidget = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const symbols = ['BTCUSDT', 'ETHUSDT', 'PAXGUSDT'];
                const promises = symbols.map(symbol =>
                    axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
                );
                const results = await Promise.all(promises);
                setStocks(results.map(r => r.data));
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        fetchStocks();
        const interval = setInterval(fetchStocks, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 animate-pulse h-60 flex items-center justify-center text-white font-medium">
            Loading Market Data...
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all"
        >
            <div className="flex items-center gap-2 mb-6">
                <FiActivity className="text-green-400 w-6 h-6" />
                <h3 className="text-white text-xl font-bold">Market Watch (IN)</h3>
            </div>

            <div className="space-y-4">
                {stocks.map((stock, index) => {
                    const isPositive = parseFloat(stock.priceChangePercent) >= 0;
                    return (
                        <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <div>
                                <p className="text-white/60 text-xs font-bold uppercase">{stock.symbol.replace('USDT', '')}</p>
                                <p className="text-white text-lg font-black">${parseFloat(stock.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className={`flex items-center gap-1 font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                                <span>{Math.abs(parseFloat(stock.priceChangePercent)).toFixed(2)}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-center text-white/30 text-[10px] mt-4 uppercase tracking-widest font-bold">
                Live Updates every 60s
            </p>
        </motion.div>
    );
};

export default StockWidget;

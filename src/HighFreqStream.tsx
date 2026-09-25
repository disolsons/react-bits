import React, { useState, useEffect, useRef } from 'react';


interface TickerData {
    symbol: string;
    price: number;
    volume: number;
    lastUpdated: string;
    direction: 'UP' | 'DOWN' | 'FLAT';
}

const TOTAL_TICKERS = 40;
const ALL_SYMBOLS = Array.from({ length: TOTAL_TICKERS }, (_, i) => `TICKER-${i.toString().padStart(4, '0')}`);

export const HighFreqStream: React.FC = () => {

    const [tickerMap, setTickerMap] = useState<Record<string, TickerData>>({});
    const [ticksPerSec, setTicksPerSec] = useState<number>(0);
    const [flushRateMs, setFlushRateMs] = useState<number>(100);
    
    const bufferRef = useRef<Record<string, TickerData>>({});
    const tickCounterRef = useRef<number>(0);

    useEffect(() => {
        // Emulate a high-frequency data stream by generating random ticker updates every 5ms.
        const streamInterval = setInterval(() => {
            const randomSymbol = ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)];
            const prevItem = bufferRef.current[randomSymbol];
            const startPrice = prevItem ? prevItem.price : 100;
            const priceChange = Number(((Math.random() - 0.5) * 1.0).toFixed(2)); // Delta between -0.50 and +0.50
            const randomPrice = Number(Math.max(1, startPrice + priceChange).toFixed(2));
            const randomVol = Math.floor(Math.random() * 1000);

            let direction: 'UP' | 'DOWN' | 'FLAT' = 'FLAT';
            if (prevItem) {
                if (randomPrice > prevItem.price) {
                    direction = 'UP';
                } else if (randomPrice < prevItem.price) {
                    direction = 'DOWN';
                }
            }

            bufferRef.current[randomSymbol] = {
                symbol: randomSymbol,
                price: randomPrice,
                volume: randomVol,
                lastUpdated: new Date().toLocaleTimeString(),
                direction: direction,
            };

            tickCounterRef.current += 1;
        }, 5);

        const renderInterval = setInterval(() => {
            setTickerMap({ ...bufferRef.current });

            const multiplier = 1000 / flushRateMs;
            setTicksPerSec(Math.round(tickCounterRef.current * multiplier));
            tickCounterRef.current = 0;
        }, flushRateMs);

        return () => {
            clearInterval(streamInterval);
            clearInterval(renderInterval);
        };
    }, [flushRateMs]); 

    return (
        <div style={{ padding: '16px', fontFamily: 'monospace', backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '8px' }}>
            <h3>High-Frequency Market Stream Buffer</h3>
            <p style={{ color: '#00ffcc' }}>
                Incoming Stream Rate: <strong>{ticksPerSec} ticks/sec</strong>
            </p>

            <div>
                <label style={{ marginRight: '8px', fontSize: '12px' }}>Flush Rate: </label>
                <select
                    value={flushRateMs}
                    onChange={(e) => setFlushRateMs(Number(e.target.value))}
                    style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #555', padding: '4px 8px', borderRadius: '4px' }}
                >
                    <option value={16}>16ms (~60 FPS - High CPU)</option>
                    <option value={100}>100ms (10 FPS - Standard)</option>
                    <option value={500}>500ms (2 FPS - Low CPU)</option>
                    <option value={1000}>1000ms (1 FPS - Eco)</option>
                </select>
            </div>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '12px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #444' }}>
                        <th style={{ padding: '8px' }}>Symbol</th>
                        <th style={{ padding: '8px' }}>Last Price ($)</th>
                        <th style={{ padding: '8px' }}>Volume</th>
                        <th style={{ padding: '8px' }}>Last Tick Time</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(tickerMap).map((item) => (
                        <tr key={item.symbol} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>{item.symbol}</td>
                            <td
                                style={{
                                    padding: '8px',
                                    color: item.direction === 'UP' ? '#4caf50' : item.direction === 'DOWN' ? '#f44336' : '#aaa',
                                    fontWeight: 'bold'
                                }}
                            >
                                {item.price.toFixed(2)}
                            </td>
                            <td style={{ padding: '8px' }}>{item.volume}</td>
                            <td style={{ padding: '8px', color: '#aaa' }}>{item.lastUpdated}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
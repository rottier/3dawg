import { useState, useEffect } from 'react';
import { setCountUpdateCallback, increment } from '../../pkg';

const Counter = () => {
    const [countValue, setCountValue] = useState(0);

    useEffect(() =>  setCountUpdateCallback((newCount: number) => setCountValue(newCount)), []);

    const handleIncrement = () => increment(1);

    return (
        <div>
            <h1>Count: {countValue}</h1>
            <button onClick={handleIncrement}>Increment</button>
        </div>
    );
};

export default Counter;
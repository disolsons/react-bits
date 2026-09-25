import { HighFreqStream } from './HighFreqStream';

export default function App() {
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Execution Tooling - UI Performance Exercise</h2>
      <HighFreqStream />
    </div>
  );
}
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function BarChart({ labels, data, color = '#5B5FEF', horizontal = false }) {
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: color,
            borderRadius: 6,
            maxBarThickness: 36,
          },
        ],
      }}
      options={{
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, grid: { display: horizontal } },
          y: { beginAtZero: true, grid: { display: !horizontal } },
        },
      }}
    />
  );
}

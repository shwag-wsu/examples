import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const ordersByDepot = {
    labels: ['Miami', 'Fort Lauderdale', 'Tampa', 'Orlando'],
    datasets: [
      {
        label: 'Orders',
        data: [14, 9, 6, 11],
        backgroundColor: ['#1E40AF', '#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  const fuelLevels = {
    labels: ['> 6000L', '3000–6000L', '< 3000L'],
    datasets: [
      {
        label: 'Trucks',
        data: [4, 3, 3],
        backgroundColor: ['#22C55E', '#FACC15', '#EF4444'],
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Fleet Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Orders by Depot</h3>
          <Bar data={ordersByDepot} />
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Fuel Levels Across Fleet</h3>
          <Doughnut data={fuelLevels} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
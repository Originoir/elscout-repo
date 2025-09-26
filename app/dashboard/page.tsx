import ReportsChart from "@/components/AttendanceChart";

export default function DashboardPage() {
  return (
    <div className="p-6">
      {/* Top stats cards (Hadir, Sakit, Izin, Alfa) */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-blue-600 font-medium">Hadir | Hari ini</h3>
          <p className="text-3xl font-bold text-blue-600">300</p>
          <span className="text-sm text-gray-500">12% increase</span>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-green-600 font-medium">Sakit | Hari ini</h3>
          <p className="text-3xl font-bold text-green-600">20</p>
          <span className="text-sm text-gray-500">12% increase</span>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-orange-500 font-medium">Izin | Hari ini</h3>
          <p className="text-3xl font-bold text-orange-500">20</p>
          <span className="text-sm text-gray-500">12% increase</span>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-red-500 font-medium">Alfa | Hari ini</h3>
          <p className="text-3xl font-bold text-red-500">10</p>
          <span className="text-sm text-gray-500">12% increase</span>
        </div>
      </div>

      {/* Reports Chart */}
      <ReportsChart />
    </div>
  );
}

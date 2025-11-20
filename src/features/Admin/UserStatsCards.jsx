import { Users, Shield, User } from 'lucide-react';

function UserStatsCards({ users }) {
  const stats = [
    { icon: Users, label: 'Total Users', value: users.length, color: 'text-blue-600' },
    { icon: Shield, label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'text-green-600' },
    { icon: User, label: 'Regular Users', value: users.filter(u => u.role === 'user').length, color: 'text-purple-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: '24px' }}>
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow-md border border-gray-200" style={{ padding: '20px' }}>
          <div className="flex items-center gap-3">
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
            <div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-black">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserStatsCards;

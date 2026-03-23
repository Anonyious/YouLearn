type Props = {
  courses: {
    percentage: number;
    totalVideos: number;
    completedLessons: number;
  }[];
};

export default function DashboardStats({ courses }: Props) {
  const total = courses.length;
  const completed = courses.filter((c) => c.percentage === 100).length;
  const inProgress = courses.filter(
    (c) => c.percentage > 0 && c.percentage < 100
  ).length;
  const totalLessons = courses.reduce((sum, c) => sum + c.totalVideos, 0);
  const doneLessons = courses.reduce((sum, c) => sum + c.completedLessons, 0);
  const lessonsPercent = totalLessons === 0 ? 0 : Math.round((doneLessons / totalLessons) * 100);

  const stats = [
    {
      label: "Total courses",
      value: total,
      sub: "in your library",
      color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
      valueColor: "text-indigo-700 dark:text-indigo-300",
      dot: "bg-indigo-500",
    },
    {
      label: "Completed",
      value: completed,
      sub: total > 0 ? `${Math.round((completed / total) * 100)}% of total` : "no courses yet",
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      valueColor: "text-green-700 dark:text-green-300",
      dot: "bg-green-500",
    },
    {
      label: "In progress",
      value: inProgress,
      sub: "keep going",
      color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
      valueColor: "text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
    },
    {
      label: "Lessons done",
      value: `${doneLessons}/${totalLessons}`,
      sub: null,
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
      valueColor: "text-purple-700 dark:text-purple-300",
      dot: "bg-purple-500",
      progress: lessonsPercent,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-2xl border ${s.color} p-4 flex flex-col gap-3`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</p>
          </div>
          <p className={`text-3xl font-bold tracking-tight ${s.valueColor}`}>
            {s.value}
          </p>
          {'progress' in s && s.progress !== undefined && (
            <div className="w-full h-1.5 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${s.progress}%` }}
              />
            </div>
          )}
          {s.sub && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">{s.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
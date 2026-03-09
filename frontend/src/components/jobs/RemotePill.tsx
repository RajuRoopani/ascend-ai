export function RemotePill({ remote }: { remote: boolean }) {
  if (!remote) return null;
  return (
    <span className="badge bg-emerald-50 text-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      Remote
    </span>
  );
}

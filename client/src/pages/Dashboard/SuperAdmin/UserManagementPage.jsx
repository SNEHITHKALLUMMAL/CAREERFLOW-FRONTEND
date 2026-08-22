import { useState } from 'react';
import { Search, ShieldCheck, ShieldOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAdminUsers, useSetUserActive } from '@/hooks/useAdmin';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/textarea';

const ROLES = ['student', 'recruiter', 'mentor', 'placementOfficer', 'collegeAdmin', 'superAdmin'];

/**
 * Platform-wide user directory with the ability to activate/deactivate any
 * account — the "kill switch" a super admin needs to shut down a
 * misbehaving or compromised account without touching the database directly.
 */
export function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminUsers({ search: search || undefined, role: role || undefined, page });
  const setActiveMutation = useSetUserActive();

  const handleToggle = (user) => {
    setActiveMutation.mutate(
      { userId: user.id, isActive: !user.isActive },
      {
        onSuccess: () => toast.success(`${user.name} ${user.isActive ? 'deactivated' : 'reactivated'}.`),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Manage users</h1>
        <p className="text-mist">Search, filter, and control access for every account on the platform.</p>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
              className="pl-10"
            />
          </div>
          <Select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="sm:w-56"
          >
            <option value="">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        {isLoading && <p className="text-sm text-mist">Loading users...</p>}

        {!isLoading && data?.items.length === 0 && (
          <CardDescription>No users match your filters.</CardDescription>
        )}

        {data?.items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-mist/15 text-xs uppercase tracking-wide text-mist dark:border-white/10">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((user) => (
                  <tr key={user.id} className="border-b border-mist/10 last:border-0 dark:border-white/5">
                    <td className="py-3 pr-4 font-medium">{user.name}</td>
                    <td className="py-3 pr-4 text-mist">{user.email}</td>
                    <td className="py-3 pr-4 capitalize">{user.role}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-danger/10 text-danger'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <Button
                        type="button"
                        size="sm"
                        variant={user.isActive ? 'outline' : 'secondary'}
                        onClick={() => handleToggle(user)}
                        disabled={setActiveMutation.isPending}
                      >
                        {user.isActive ? (
                          <>
                            <ShieldOff className="h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4" />
                            Reactivate
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-mist">
            <span>
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

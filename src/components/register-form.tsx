import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { register } from "@/api/auth";
import { getOrganizations } from "@/api/organizations";
import type { Organization } from "@/api/organizations";

type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
  organizationId: number;
};

export function SignupForm(props: React.ComponentProps<typeof Card>) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationId, setOrganizationId] = useState<number | "">("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ORGANIZATIONS ================= */
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (err) {
        console.error("Failed to load organizations", err);
        setError("Gagal mengambil data organisasi");
      }
    };

    fetchOrganizations();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    if (!organizationId) {
      setError("Silakan pilih organisasi");
      return;
    }

    const payload: RegisterPayload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      roleId: 1, // STAFF
      organizationId: Number(organizationId),
    };

    try {
      setLoading(true);
      await register(payload);

      setSuccess("Registrasi berhasil. Tunggu verifikasi admin.");

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setOrganizationId("");
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Staff Registration</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Organization</FieldLabel>
              <select
                className="border rounded px-3 py-2 w-full"
                value={organizationId}
                onChange={(e) => setOrganizationId(Number(e.target.value))}
                required
              >
                <option value="" disabled>
                  Pilih organisasi
                </option>

                {organizations.map((org) => (
                  <option key={org.ID} value={org.ID}>
                    {org.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
              />
            </Field>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Create Account"}
              </Button>
              <FieldDescription className="px-4 text-center">
                Already have an account? <a href="/login">Login</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

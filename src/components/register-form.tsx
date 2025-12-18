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
import { useState } from "react";
import { register } from "@/api/auth";
import { useNavigate } from "@tanstack/react-router";

export function SignupForm(props: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        roleId: 1, // ✅ STAFF
        organizationId: 1, // ✅ HARDCODE
      });

      alert("Registrasi berhasil. Tunggu verifikasi admin.");
      navigate({ to: "/login" });
    } catch {
      setError("Registrasi gagal");
    }
  };

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
                  setForm({
                    ...form,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </Field>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Field>
              <Button type="submit">Create Account</Button>
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

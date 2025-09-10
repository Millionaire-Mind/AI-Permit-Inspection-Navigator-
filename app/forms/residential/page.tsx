"use client";

import { Home } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import FormLayout from "../../../components/forms/FormLayout";

const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

const ResidentialSchema = z.object({
  applicantName: z.string().min(1, "Applicant name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  projectDescription: z.string().min(1, "Project description is required"),
  squareFootage: z.coerce.number().positive("Must be positive"),
  estimatedValue: z.coerce.number().positive("Must be positive"),
  contractorName: z.string().min(1, "Contractor name is required"),
  contractorLicense: z.string().min(1, "License number is required"),
});

type ResidentialFormData = z.infer<typeof ResidentialSchema>;

export default function ResidentialFormPage() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResidentialFormData>({ resolver: zodResolver(ResidentialSchema) });

  useEffect(() => {
    if (session?.user) {
      reset((prev) => ({
        ...prev,
        applicantName: session.user.name ?? prev.applicantName,
        email: (session.user as any).email ?? prev.email,
      }));
    }
  }, [session, reset]);

  const onSubmit = async (data: ResidentialFormData) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "residential", ...data }),
      });
      if (!res.ok) throw new Error("Request failed");
      const json = await res.json();
      if (json?.success) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <FormLayout
      title={"Residential Building Permit"}
      titleIcon={<Home className="h-6 w-6" />}
      description={"Complete the form to submit your residential building permit."}
      onSubmit={handleSubmit(onSubmit)}
      successMessage={status === "success" ? "Successfully submitted Residential Building Permit." : undefined}
      errorMessage={status === "error" ? "There was an error submitting the form. Please try again." : undefined}
      submitting={isSubmitting}
      submitLabel="Submit Application"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Applicant Name</label>
          <input {...register("applicantName")} className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.applicantName && <p className="text-sm text-red-600 mt-1">{errors.applicantName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input {...register("address")} className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input type="tel" {...register("phone")} className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" {...register("email")} className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Project Description</label>
          <textarea rows={4} {...register("projectDescription")} className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.projectDescription && <p className="text-sm text-red-600 mt-1">{errors.projectDescription.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Square Footage</label>
          <input type="number" {...register("squareFootage", { valueAsNumber: true })} className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.squareFootage && <p className="text-sm text-red-600 mt-1">{errors.squareFootage.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Estimated Value ($)</label>
          <input type="number" step="0.01" {...register("estimatedValue", { valueAsNumber: true })} className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.estimatedValue && <p className="text-sm text-red-600 mt-1">{errors.estimatedValue.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Contractor Name</label>
          <input {...register("contractorName")} className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.contractorName && <p className="text-sm text-red-600 mt-1">{errors.contractorName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Contractor License #</label>
          <input {...register("contractorLicense")} className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.contractorLicense && <p className="text-sm text-red-600 mt-1">{errors.contractorLicense.message}</p>}
        </div>
      </div>
    </FormLayout>
  );
}


"use client";

import { Cog } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import FormLayout from "../../../components/forms/FormLayout";

const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

const MechanicalSchema = z.object({
  applicantName: z.string().min(1, "Applicant name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  equipmentType: z.enum(["Furnace", "AC", "Heat Pump", "Other"]),
  btuRating: z.coerce.number().positive("BTU rating must be positive"),
  contractorName: z.string().min(1, "Contractor name is required"),
  contractorLicense: z.string().min(1, "License number is required"),
});

type MechanicalFormData = z.infer<typeof MechanicalSchema>;

export default function MechanicalFormPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MechanicalFormData>({ resolver: zodResolver(MechanicalSchema) });

  const onSubmit = async (data: MechanicalFormData) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "mechanical", ...data }),
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
      title={"Mechanical Permit Application"}
      titleIcon={<Cog className="h-6 w-6" />}
      description={"Complete the form to submit your mechanical permit application."}
      onSubmit={handleSubmit(onSubmit)}
      successMessage={status === "success" ? "Successfully submitted Mechanical Permit Application." : undefined}
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
        <div>
          <label className="block text-sm font-medium">Equipment Type</label>
          <select {...register("equipmentType")} className="mt-1 w-full rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Furnace">Furnace</option>
            <option value="AC">AC</option>
            <option value="Heat Pump">Heat Pump</option>
            <option value="Other">Other</option>
          </select>
          {errors.equipmentType && <p className="text-sm text-red-600 mt-1">{errors.equipmentType.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">BTU Rating</label>
          <input type="number" {...register("btuRating", { valueAsNumber: true })} className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.btuRating && <p className="text-sm text-red-600 mt-1">{errors.btuRating.message}</p>}
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


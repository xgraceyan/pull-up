import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { checkEventUrlExists } from "@/api/events";
import type { Control } from "react-hook-form";

export const baseFormSchemaFields = {
  name: z.string().min(1, "Event name is required."),
  urlAlias: z
    .string()
    .optional()
    .refine(
      async (urlAlias) => {
        if (!urlAlias || urlAlias.length == 0) return true;
        return !(await checkEventUrlExists(urlAlias));
      },
      {
        message: "This url already exists!",
      }
    ),
};

export const baseFormDefaultValues = {
  name: "",
  urlAlias: "",
};

interface BaseFormHeaderProps {
  title: string;
  description: string;
}

export const BaseFormHeader = ({ title, description }: BaseFormHeaderProps) => {
  return (
    <CardHeader className="text-center">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};

interface BaseFormFieldProps {
  control: Control<any>;
}

export const BaseFormFields = ({ control }: BaseFormFieldProps) => {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Name</FormLabel>
            <FormControl>
              <Input placeholder="My Meeting" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="urlAlias"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custom URL</FormLabel>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">events/</p>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

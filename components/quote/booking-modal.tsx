"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; email?: string }) => void;
  isSubmitting?: boolean;
}

export function BookingModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: BookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onSubmit({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
      });
    }
  };

  const isValid = name.trim().length >= 2 && phone.trim().length >= 8;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-0 rounded-2xl shadow-beefy-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-3xl">🎉</span>
          </div>
          <DialogTitle className="font-heading text-2xl">Awesome!</DialogTitle>
          <p className="text-muted-foreground mt-2">
            William will visit your property to confirm the quote and discuss
            your lawn care needs.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="rounded-xl border-0 bg-muted py-5"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="027 123 4567"
              className="rounded-xl border-0 bg-muted py-5"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="rounded-xl border-0 bg-muted py-5"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl border-2"
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={cn(
                "flex-1 bg-gradient-to-br from-beefy-red to-beefy-red-dark text-white",
                "font-heading font-semibold rounded-xl",
                "transition-all hover:-translate-y-0.5 hover:shadow-lg",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              )}
            >
              {isSubmitting ? "Submitting..." : "Request Visit ✓"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

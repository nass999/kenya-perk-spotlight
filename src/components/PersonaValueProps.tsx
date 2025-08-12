import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Handshake } from "lucide-react";

const PersonaValueProps = () => {
  return (
    <section aria-labelledby="personas" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <header className="mb-10 md:mb-14 text-center">
          <h2 id="personas" className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Built for Employers and Vendors
          </h2>
          <p className="mt-3 md:mt-4 text-muted-foreground max-w-2xl mx-auto">
            Clear value for every stakeholder using a single, seamless platform.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card className="h-full">
            <CardHeader className="space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">For Employers & HR Teams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                Effortlessly offer your employees access to hundreds of curated discounts — helping them save thousands annually, boost satisfaction, and strengthen retention — all in one seamless platform.
              </p>
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Example impact:</span> In just 12 months, one company’s 500 employees saved over KSh 3.2 million on groceries, fuel, and household essentials — with zero admin overhead for HR.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Handshake className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">For Vendors & Partners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                Gain direct access to a ready-made audience of thousands of qualified buyers — your products and services showcased where employees are already looking to spend and save.
              </p>
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Example impact:</span> A local gym partner increased membership sign-ups by 27% in three months, generating an additional KSh 1.5 million in recurring revenue from platform users.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PersonaValueProps;

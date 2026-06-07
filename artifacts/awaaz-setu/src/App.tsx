import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/pages/Home";
import { Report } from "@/pages/Report";
import { Track } from "@/pages/Track";
import { Admin } from "@/pages/Admin";
import { Awareness } from "@/pages/Awareness";
import { HowItWorks } from "@/pages/HowItWorks";
import { Government } from "@/pages/Government";
import { Systems } from "@/pages/Systems";
import { Policies } from "@/pages/Policies";
import { Faq } from "@/pages/Faq";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/report" component={Report} />
          <Route path="/track" component={Track} />
          <Route path="/admin" component={Admin} />
          <Route path="/awareness" component={Awareness} />
          <Route path="/government" component={Government} />
          <Route path="/systems" component={Systems} />
          <Route path="/policies" component={Policies} />
          <Route path="/faq" component={Faq} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

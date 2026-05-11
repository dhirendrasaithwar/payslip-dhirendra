// import { cn } from "@/lib/utils";

// function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
//   return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />;
// }

// export { Skeleton };

import { cn } from "@/lib/utils";
import React from "react";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/40 dark:bg-white/10", className)}
      {...props}
    />
  );
}

export { Skeleton };

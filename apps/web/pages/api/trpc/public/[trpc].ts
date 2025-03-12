import type { NextApiRequest, NextApiResponse } from "next";
import { createContext } from "@calcom/trpc/server/createContext";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { router } from "@calcom/trpc/server/trpc";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Start performance measurement
    const startTime = performance.now();
    
    // Track loaded modules
    const loadedModules = new Set();
    const originalRequire = module.require;
    
    // Override require to track modules
    module.require = function(path) {
      loadedModules.add(path);
      return originalRequire.apply(this, arguments);
    };
    
    const path = req.query.trpc as string;
    const procedureName = path.split('.')[0];
    
    console.log(`[tRPC] Loading procedure: ${procedureName}`);

    try {
      // Dynamically import just the requested procedure from the _router file
      const { [procedureName]: procedureImplementation } = await import("@calcom/trpc/server/routers/publicViewer/_router");
      
      if (!procedureImplementation) {
        console.error(`[tRPC] Procedure ${procedureName} not found in _router`);
        res.status(404).json({ message: 'Procedure not found' });
        return;
      }

      console.log(`[tRPC] Loaded procedure: ${procedureName}`);
      
      // Create a minimal router with just the requested procedure
      console.log(`[tRPC] Creating minimal router for procedure: ${procedureName}`);
      const minimalRouter = router({
        [procedureName]: procedureImplementation,
      });
      
      // Use the Next.js adapter
      const nextApiHandler = createNextApiHandler({
        router: minimalRouter,
        createContext,
        onError: (opts) => {
          console.error(opts.error);
          return {
            status: opts.error.code === 'NOT_FOUND' ? 404 : 500,
          };
        },
      });
      
      // Call the handler
      await nextApiHandler(req, res);
      
    } catch (importError) {
      console.error(`[tRPC] Error importing procedure: ${importError}`);
      
      // Fallback to the original approach
      console.log(`[tRPC] Falling back to original router import`);
      
      // Import the full router
      const { publicViewerRouter } = await import("@calcom/trpc/server/routers/publicViewer/_router");
      
      // Use the Next.js adapter for the full router
      const nextApiHandler = createNextApiHandler({
        router: publicViewerRouter,
        createContext,
        onError: (opts) => {
          console.error(opts.error);
          return {
            status: opts.error.code === 'NOT_FOUND' ? 404 : 500,
          };
        },
      });
      
      // Call the handler
      await nextApiHandler(req, res);
    }
    
    // After handling the request
    const endTime = performance.now();
    console.log(`[tRPC] Procedure: ${path}, Modules loaded: ${loadedModules.size}, Time: ${endTime - startTime}ms`);
    
    // Restore original require
    module.require = originalRequire;
    
  } catch (error) {
    console.error('tRPC handler error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

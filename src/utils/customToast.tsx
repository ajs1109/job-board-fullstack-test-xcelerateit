"use client"

import { toast } from 'sonner';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const errorToast = (message: string, description?: string) => {
    toast(message, {
        description: description,
        duration: 5000,
        icon: <AlertCircle className="h-4 w-4" />,
        style: {
        backgroundColor: '#FF4C4C',
        color: '#fff',
        },
    });
}

export const successToast = (message: string, description?: string) => {
    toast(message, {
        description: description,
        duration: 5000,
        icon: <CheckCircle className="h-4 w-4" />   
    });
}

export const infoToast = (message: string, description?: string) => {
    toast(message, {
        description: description,
        duration: 5000, 
    });
}

export const DottedSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="relative h-10 w-10">
        {/* Dots positioned in a circle */}
        {[...Array(8)].map((_, i) => {
          // Calculate position and delay for each dot
          const angle = (i * Math.PI) / 4; // 8 dots evenly spaced
          const delay = `${i * 125}ms`;
          
          // Position dots in a circle
          const style = {
            left: `${50 + 40 * Math.cos(angle)}%`,
            top: `${50 + 40 * Math.sin(angle)}%`,
            animationDelay: delay
          };
          
          return (
            <div 
              key={i}
              className="absolute h-2 w-2 bg-primary rounded-full animate-pulse opacity-75"
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
}

export const ButtonLoader = () => {
  return (
    <div className="flex space-x-1 my-auto">
      <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
      <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></div>
      <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
    </div>
  );
}
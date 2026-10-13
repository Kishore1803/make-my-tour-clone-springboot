"use client";

interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <div className="mb-3 h-1 w-16 rounded-full bg-blue-600" />
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
        {description}
      </p>
    </header>
  );
}

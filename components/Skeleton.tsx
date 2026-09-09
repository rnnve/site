import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export default function Skeleton({ className = '', ...props }: SkeletonProps) {
	return <div className={`skeleton ${className}`} aria-hidden="true" {...props} />;
}
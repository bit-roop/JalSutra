import clsx from "clsx";

type DecorativeDividerProps = {
  className?: string;
};

export default function DecorativeDivider({ className }: DecorativeDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "h-3 w-full bg-[url('/assets/patterns/divider.png')] bg-contain bg-center bg-repeat-x opacity-45",
        className
      )}
    />
  );
}

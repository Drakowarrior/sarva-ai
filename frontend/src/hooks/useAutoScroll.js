import { useEffect, useRef } from "react";

export default function useAutoScroll(
  dependency
) {
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [dependency]);

  return ref;
}
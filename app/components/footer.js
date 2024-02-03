import FormSubmit from "./formsubmit";

export default function Footer() {
  return (
    <footer className="relative bottom-0 left-0 z-50 flex h-auto w-full flex-col items-center justify-center bg-gray-200 fill-current py-5 sm:flex-row">
      <h3 className="select-none text-xl font-bold no-underline">
        👌 Made by{" "}
        <a
          className="text-xl no-underline hover:text-blue-600"
          href="https://yusifaliyevpro.com"
          target="_blank"
        >
          YusifAliyevPro
        </a>
      </h3>
      <FormSubmit />
    </footer>
  );
}

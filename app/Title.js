function Title({ title, image = "/two.webp" }) {
  return (
    <section
      style={{
        backgroundImage: `url("${image}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="py-7 flex h-full w-full items-center justify-center  mx-auto px-8 lg:w-full bg-black bg-opacity-50">
        <div className="max-w-2xl text-center">
          <h1 className=" py-20 text-white lg:text-6xl font-semibold uppercase">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}

export default Title;

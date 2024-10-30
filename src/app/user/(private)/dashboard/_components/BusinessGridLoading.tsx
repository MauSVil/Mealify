const BusinessGridLoading = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {
        Array(10).fill(0).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 cursor-pointer"
          >
            <div className="w-full relative min-h-[185px] animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
          </div>
        ))
      }
    </div>
  )
}

export default BusinessGridLoading;
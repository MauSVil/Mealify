const BusinessIdContentLoading = () => {
  return (
    <div className="flex flex-col gap-12">
      <div className="relative w-full h-16 md:h-36 animate-pulse rounded-md bg-muted">
        <div className="absolute -bottom-8 left-4 h-20 w-20 rounded-full border-2 border-slate-200 bg-muted"></div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {
          Array(10).fill(0).map((_, index) => (
            <div key={index} className="flex relative items-center justify-between w-full gap-4 min-h-36">
              <div className="h-full flex flex-1 flex-col gap-1 border-r-2 p-4">
                <div className="h-5 w-full animate-pulse rounded-md bg-muted"></div>
                <div className="h-20 w-full animate-pulse rounded-md bg-muted"></div>
              </div>
              <div className="relative w-1/3 h-full">
                <div className="h-full w-full animate-pulse rounded-md bg-muted"></div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default BusinessIdContentLoading;
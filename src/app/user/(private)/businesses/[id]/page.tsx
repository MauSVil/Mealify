import BusinessIdContent from "./_components/Content";

const UserBusinessPage = (props: { params: { id: string } }) => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <BusinessIdContent id={props.params.id} />
    </div>
  )
}

export default UserBusinessPage;
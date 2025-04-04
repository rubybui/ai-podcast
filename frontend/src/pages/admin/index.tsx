import type { NextPageWithLayout } from "../_app";

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/admin/podcast",
      permanent: false,
    },
  };
}

const AdminPage: NextPageWithLayout = () => {
  return null;
};

export default AdminPage;

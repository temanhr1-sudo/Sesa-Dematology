import Hero from './Hero';
import Services from './Services';
import ClinicInformation from './ClinicInformation';
import FeaturedProducts from './FeaturedProducts';
import Testimonials from './Testimonials';

const Home = () => {
  return (
    <main className="bg-[#FAFAFA]">
      <Hero />
      <Services />
      <ClinicInformation />
      <FeaturedProducts />
      <Testimonials />
    </main>
  );
};

export default Home;
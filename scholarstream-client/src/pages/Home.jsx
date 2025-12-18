import { Helmet } from 'react-helmet-async';
import Banner from '../components/home/Banner';
import TopScholarships from '../components/home/TopScholarships';
import SuccessStories from '../components/home/SuccessStories';
import FAQ from '../components/home/FAQ';
import Stats from '../components/home/Stats';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>ScholarStream - Find Your Dream Scholarship</title>
      </Helmet>
      
      <Banner />
      <Stats />
      <TopScholarships />
      <SuccessStories />
      <FAQ />
    </>
  );
};

export default Home;

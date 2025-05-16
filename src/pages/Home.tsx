import TrendingUp from '../assets/icons/TrendingUp';
import ArrowRise from '../assets/icons/ArrowRise';

const cardsData = [
  {
    title: 'عدد المبيعات الشهرية',
    value: '500 سيارة',
    percentage: 80,
    trend: '600 سيارة',
    salesValue: '700,000,000',
  },
  {
    title: 'عدد المبيعات الشهرية',
    value: '500 سيارة',
    percentage: 80,
    trend: '600 سيارة',
    salesValue: '700,000,000',
  },
  {
    title: 'عدد المبيعات الشهرية',
    value: '500 سيارة',
    percentage: 80,
    trend: '600 سيارة',
    salesValue: '700,000,000',
  },
  {
    title: 'عدد المبيعات الشهرية',
    value: '500 سيارة',
    percentage: 80,
    trend: '600 سيارة',
    salesValue: '700,000,000',
  },
];

const Home = () => {
  return (
    <div>
      <div>
        <button className="bg-primary-500 rounded-2xl py-2.5 px-4 text-white text-2xl font-normal">
          + اضافة جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="bg-[linear-gradient(218deg,_#DFEDFB_32.02%,_#C8E0F9_44.63%,_#91C2F2_74.12%)] shadow-[1px_2px_16px_0px_#4899EA1F] p-4 rounded-xl flex items-center gap-4"
          >
            <div className="flex-1 flex flex-col gap-1">
              <div className="text-xl font-bold text-primary-800">{card.title}</div>
              <div className="text-xl font-normal text-black">{card.value}</div>

              <div className="text-xl font-medium text-success-500 flex items-center">
                <span className="ml-1">
                  <ArrowRise />
                </span>{' '}
                {card.trend}
              </div>

              <div className="text-2xl font-medium text-black">
                قيمة المبيعات <TrendingUp className="inline-block mr-1" />
              </div>
              <div className="text-primary-700 text-2xl font-medium">{card.salesValue}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

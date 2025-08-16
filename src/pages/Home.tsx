import TrendingUp from '../assets/icons/TrendingUp';
import ArrowRise from '../assets/icons/ArrowRise';
import { useEffect, useState } from 'react';
import AddCompanyModal from '../components/AddNewModal';
import axios from '../services/axios'
import ContractsChart from '../components/ContractsChart';
import SalesChart from '../components/SalesChart';
import CustomDatePicker from '../components/Form/DateFiled/CustomDatePicker';
import SelectField from '../components/Form/SelectField';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [type, setType] = useState('');
  const [cardsData, setCardsData] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/dashboard?start=2025-01-01&dateType=year')
      .then(response => {
        const data = response.data.data;

        /* the data will be like this data
: 
{month: {paidInstallmentsCount: 2000000, completedPlansCount: 3, contractsCount: 8},…}
day
: 
{paidInstallmentsCount: 0, completedPlansCount: 0, contractsCount: 0}
completedPlansCount
: 
0
contractsCount
: 
0
paidInstallmentsCount
: 
0
month
: 
{paidInstallmentsCount: 2000000, completedPlansCount: 3, contractsCount: 8}
completedPlansCount
: 
3
contractsCount
: 
8
paidInstallmentsCount
: 
2000000
week
: 
{paidInstallmentsCount: 1000000, completedPlansCount: 0, contractsCount: 0}
completedPlansCount
: 
0
contractsCount
: 
0
paidInstallmentsCount
: 
1000000
year
: 
{paidInstallmentsCount: 8006500, completedPlansCount: 12, contractsCount: 17}
completedPlansCount
: 
12
contractsCount
: 
17
paidInstallmentsCount
: 
8006500 */
        setCardsData([
          {
            title: 'عدد المبيعات اليومية',
            value: `${data.day.completedPlansCount} سيارة`,
            trend: `${data.day.contractsCount} سيارة`,
            salesValue: data.day.paidInstallmentsCount.toLocaleString(),
          },{
            title: 'عدد المبيعات الاسبوعية',
            value: `${data.week.completedPlansCount} سيارة`,
            trend: `${data.week.contractsCount} سيارة`,
            salesValue: data.week.paidInstallmentsCount.toLocaleString(),
          },{
            title: 'عدد المبيعات الشهرية',
            value: `${data.month.completedPlansCount} سيارة`,
            trend: `${data.month.contractsCount} سيارة`,
            salesValue: data.month.paidInstallmentsCount.toLocaleString(),
          },{
            title: 'عدد المبيعات السنوية',
            value: `${data.year.completedPlansCount} سيارة`,
            trend: `${data.year.contractsCount} سيارة`,
            salesValue: data.year.paidInstallmentsCount.toLocaleString(),
          },
        ]);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
  }, []);
  return (
    <div>
      <AddCompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-500 rounded-2xl py-2.5 px-4 text-white text-2xl font-normal"
        >
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
                {card.trend}
                </span>{' '}
                  <ArrowRise />
              </div>

              <div className="text-2xl font-medium text-black">
                قيمة المبيعات <TrendingUp className="inline-block mr-1" />
              </div>
              <div className="text-primary-700 text-2xl font-medium">{card.salesValue}</div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex gap-4 mt-4'>
        <CustomDatePicker
          name='date'
          onChange={(e: any) => setDate(e.target.value)}
          value={date}
          placeholder='حدد التاريخ لعرض البيانات'
        />
        <SelectField
          name='type'
          onChange={(e: any) => setType(e.target.value)}
          options={[
            { value: 'year', label: 'سنة' },
            { value: 'month', label: 'شهر' },
            { value: 'week', label: 'اسبوع' },
            { value: 'day', label: 'يوم' },
          ]}
          value={type}
          placeholder='حدد المدة'
        />
      </div>
      {date && type && (
        <div className='flex flex-col md:flex-row gap-4 mt-4 w-full'>
          <div className='flex-1'>
            <ContractsChart date={date} type={type} />
          </div>
          <div className='flex-1'>
            <SalesChart date={date} type={type} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

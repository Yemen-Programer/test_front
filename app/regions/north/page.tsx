'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Music, Shirt, Utensils, ArrowLeft, Mic, Hammer, Users, Baby } from 'lucide-react';
import './page.css';
import Header from '@/app/components/header';
import ContentService from '../../../services/content';


// تعريف الأنواع TypeScript
interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

interface RegionData {
  name: string;
  description: string;
  heritageSites: ContentItem[];
  intangibleHeritage: {
    oral: ContentItem[];
    folklore: ContentItem[];
    crafts: ContentItem[];
  };
  clothing: {
    men: ContentItem[];
    women: ContentItem[];
    boys: ContentItem[];
    girls: ContentItem[];
  };
  food: ContentItem[];
}

if (typeof window !== "undefined") {
  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
  document.head.appendChild(script);
}

const NorthernRegionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'heritage' | 'intangible' | 'clothing' | 'food'>('heritage');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // عنوان الباك إند - تأكد من تعديله حسب إعداداتك
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // دالة لمعالجة URLs الصور
  const processImageUrls = (data: any): RegionData => {
    const processItems = (items: ContentItem[]): ContentItem[] => {
      return items.map(item => ({
        ...item,
        imageUrl: item.imageUrl 
          ? `${API_BASE_URL}/uploads/${item.imageUrl}`
          : null
      }));
    };

    return {
      ...data,
      heritageSites: processItems(data.heritageSites || []),
      intangibleHeritage: {
        oral: processItems(data.intangibleHeritage?.oral || []),
        folklore: processItems(data.intangibleHeritage?.folklore || []),
        crafts: processItems(data.intangibleHeritage?.crafts || [])
      },
      clothing: {
        men: processItems(data.clothing?.men || []),
        women: processItems(data.clothing?.women || []),
        boys: processItems(data.clothing?.boys || []),
        girls: processItems(data.clothing?.girls || [])
      },
      food: processItems(data.food || [])
    };
  };

  // بيانات افتراضية للاستخدام أثناء التحميل أو في حالة الخطأ
  const defaultRegionData: RegionData = {
    name: 'المنطقة الشمالية',
    description: 'تُعد المنطقة الشمالية إحدى أجمل مناطق المملكة، حيث تمتزج فيها الحضارات القديمة مع تنوع الطبيعة بين الواحات والصحارى والجبال. تضم مواقع أثرية بارزة مثل قلعة مارد، دومة الجندل، مدائن شعيب، وآبار تيماء التي تعكس تاريخها العريق ودورها التجاري القديم. وتتميز بكونها مركزًا زراعيًا مهمًا خاصة في إنتاج الزيتون في منطقة الجوف. وفي العصر الحديث تشهد نهضة عمرانية وسياحية كبرى بوجود مشاريع مثل نيوم وتنوع الوجهات في سكاكا وتبوك وعرعر.',
    heritageSites: [],
    intangibleHeritage: {
      oral: [],
      folklore: [],
      crafts: []
    },
    clothing: {
      men: [],
      women: [],
      boys: [],
      girls: []
    },
    food: []
  };

  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        setLoading(true);
        // استبدل 'northern' بمعرف المنطقة الفعلي من قاعدة البيانات
        const response = await ContentService.getRegionStructure('northern');
        console.log('API Response:', response); // للتصحيح
        
        if (response.success) {
          // معالجة URLs الصور
          const processedData = processImageUrls(response.data);
          setRegionData(processedData);
        } else {
          throw new Error(response.message || 'فشل في جلب البيانات');
        }
      } catch (err) {
        console.error('Error fetching region data:', err);
        setError('فشل في تحميل بيانات المنطقة');
        setRegionData(defaultRegionData);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
  }, []);

  // كروت التصنيفات للتراث غير المادي
  const intangibleCategories = [
    { id: 'oral', name: 'التراث الشفوي', icon: <Mic size={24} /> },
    { id: 'folklore', name: 'الفلكلور', icon: <Music size={24} /> },
    { id: 'crafts', name: 'الحرف اليدوية', icon: <Hammer size={24} /> }
  ];

  // كروت التصنيفات للأزياء
  const clothingCategories = [
    { id: 'men', name: 'الأزياء الرجالية', icon: <Users size={24} /> },
    { id: 'women', name: 'الأزياء النسائية', icon: <Users size={24} /> },
    { id: 'boys', name: 'أزياء الأطفال بنين', icon: <Baby size={24} /> },
    { id: 'girls', name: 'أزياء الأطفال بنات', icon: <Baby size={24} /> }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  // دالة للتعامل مع أخطاء تحميل الصور
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    // إظهار العنصر البديل
    const placeholder = target.nextElementSibling as HTMLElement;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="region-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل بيانات المنطقة...</p>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error && !regionData) {
    return (
      <div className="region-page">
        <Header />
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // استخدام البيانات الفعلية أو الافتراضية
  const data = regionData || defaultRegionData;

  return (
    <div className="region-page">
      <Header />

      {/* رأس الصفحة */}
      <header className="region-header">
        <div className="header-content pt-20">
          <h1 className="region-title">المنطقة الشمالية</h1>
          <p className="region-description">تُعد المنطقة الشمالية إحدى أجمل مناطق المملكة، حيث تمتزج فيها الحضارات القديمة مع تنوع الطبيعة بين الواحات والصحارى والجبال. تضم مواقع أثرية بارزة مثل قلعة مارد، دومة الجندل، مدائن شعيب، وآبار تيماء التي تعكس تاريخها العريق ودورها التجاري القديم. وتتميز بكونها مركزًا زراعيًا مهمًا خاصة في إنتاج الزيتون في منطقة الجوف. وفي العصر الحديث تشهد نهضة عمرانية وسياحية كبرى بوجود مشاريع مثل نيوم وتنوع الوجهات في سكاكا وتبوك وعرعر.</p>
        </div>
      </header>

      {/* شريط التبويب */}
      <nav className="tabs-nav">
        <button 
          className={`tab-button ${activeTab === 'heritage' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('heritage');
            setSelectedCategory(null);
          }}
        >
          <MapPin size={20} />
          الأماكن التراثية والأثرية
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'intangible' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('intangible');
            setSelectedCategory(null);
          }}
        >
          <Music size={20} />
          التراث الغير مادي
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'clothing' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('clothing');
            setSelectedCategory(null);
          }}
        >
          <Shirt size={20} />
          الأزياء التقليدية
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('food');
            setSelectedCategory(null);
          }}
        >
          <Utensils size={20} />
          الأكلات الشعبية
        </button>
      </nav>

      {/* محتوى التبويب النشط */}
      <main className="tab-content">
        {activeTab === 'heritage' && (
          <div className="heritage-content">
            <h2>الأماكن التراثية والأثرية</h2>
            {data.heritageSites.length === 0 ? (
              <div className="empty-state">
                <p>لا توجد أماكن تراثية متاحة حالياً</p>
              </div>
            ) : (
              <div className="items-grid">
                {data.heritageSites.map((site, index) => (
                  <div key={site.id || index} className="item-card">
                    <div className="item-image">
                      {site.imageUrl ? (
                        <img 
                          src={site.imageUrl} 
                          alt={site.title}
                          onError={handleImageError}
                        />
                      ) : null}
                      <div className={`image-placeholder ${site.imageUrl ? 'hidden' : ''}`}>
                        <MapPin size={40} />
                      </div>
                    </div>
                    <div className="item-info">
                      <h3>{site.title}</h3>
                      <p>{site.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'intangible' && (
          <div className="intangible-content">
            {!selectedCategory ? (
              <>
                <h2>اختر نوع التراث غير المادي</h2>
                <div className="categories-grid">
                  {intangibleCategories.map((category) => (
                    <div
                      key={category.id}
                      className="category-card"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <div className="category-icon">
                        {category.icon}
                      </div>
                      <h3>{category.name}</h3>
                      <div className="card-hint">انقر للاستكشاف</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="category-header">
                  <button className="back-categories" onClick={handleBackToCategories}>
                    <ArrowLeft size={16} />
                    العودة للتصنيفات
                  </button>
                  <h2>{intangibleCategories.find(cat => cat.id === selectedCategory)?.name}</h2>
                </div>
                <div className="items-grid">
                  {data.intangibleHeritage[selectedCategory as keyof typeof data.intangibleHeritage]?.map((item: ContentItem, index: number) => (
                    <div key={item.id || index} className="item-card">
                      <div className="item-image">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            onError={handleImageError}
                          />
                        ) : null}
                        <div className={`image-placeholder ${item.imageUrl ? 'hidden' : ''}`}>
                          <Music size={40} />
                        </div>
                      </div>
                      <div className="item-info">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'clothing' && (
          <div className="clothing-content">

            {!selectedCategory ? (
              <>
                <h2>اختر نوع الأزياء</h2>
                <div className="categories-grid">
                  {clothingCategories.map((category) => (
                    <div key={category.id} className="category-card"
                      onClick={() => handleCategorySelect(category.id)}>
                      <div className="category-icon">{category.icon}</div>
                      <h3>{category.name}</h3>
                      <div className="card-hint">انقر للاستكشاف</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="category-header">
                  <button className="back-categories" onClick={handleBackToCategories}>
                    <ArrowLeft size={16} /> العودة للتصنيفات
                  </button>
                  <h2>{clothingCategories.find(c => c.id === selectedCategory)?.name}</h2>
                </div>

                <div className="items-grid">

                  {data.clothing[selectedCategory as keyof typeof data.clothing].map((item, index) => (
                    <div key={item.id || index} className="item-card clothing-3d">

                      {/* الصورة 3D على اليسار */}
                      <div className="left-side">
                        {item.imageUrl ? (
                          <model-viewer
                            src="/images/clo/2.glb"
                            alt={item.title}
                            camera-controls
                            auto-rotate
                            style={{ width: '350px', height: '350px' }}
                          ></model-viewer>
                        ) : (
                          <div className="image-placeholder">
                            <Shirt size={40} />
                          </div>
                        )}
                      </div>

                      {/* النص على اليمين */}
                      <div className="right-side">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}

                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'food' && (
          <div className="food-content">
            <h2>الأكلات الشعبية</h2>
            {data.food.length === 0 ? (
              <div className="empty-state">
                <p>لا توجد أكلات شعبية متاحة حالياً</p>
              </div>
            ) : (
              <div className="items-grid">
                {data.food.map((item, index) => (
                  <div key={item.id || index} className="item-card">
                    <div className="item-image">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          onError={handleImageError}
                        />
                      ) : null}
                      <div className={`image-placeholder ${item.imageUrl ? 'hidden' : ''}`}>
                        <Utensils size={40} />
                      </div>
                    </div>
                    <div className="item-info">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default NorthernRegionPage;
'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Music, Shirt, Utensils, ArrowLeft, Mic, Hammer, Users, Baby, Heart, Bookmark, BookmarkCheck } from 'lucide-react';
import '../north/page.css';
import Header from '../../components/header';
import ContentService from '../../../services/content';
import VoteService from '../north/services/Vote';
import WishlistService from '../north/services/wishlist';
import Link from 'next/link';

// تعريف الأنواع TypeScript
interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  googlemapsurl: string;
  model3d?: string;
  coordinates?: string;
  votesCount: number;
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

const CentralRegionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'heritage' | 'intangible' | 'clothing' | 'food'>('heritage');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [votedContents, setVotedContents] = useState<Set<string>>(new Set());
  const [wishlistedContents, setWishlistedContents] = useState<Set<string>>(new Set());
  const [votesCount, setVotesCount] = useState<{[key: string]: number}>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // دالة لمعالجة URLs الصور
  const processImageUrls = (data: any): RegionData => {
    const processItems = (items: ContentItem[]): ContentItem[] => {
        return items.map(item => ({
          ...item,
          imageUrl: item.imageUrl 
            ? `${API_BASE_URL}/uploads/${item.imageUrl}`
            : null,
          model3d: item.model3d 
            ? `${API_BASE_URL}/uploads/${item.model3d}`
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

  // جلب userId من localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        
        return null;
      } catch (error) {
        console.error('❌ خطأ في جلب بيانات المستخدم:', error);
        return null;
      }
    };

    getUserFromStorage();
  }, []);

  // تحميل بيانات المنطقة
  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        setLoading(true);
        console.log('🔄 جلب بيانات المنطقة الوسطى...');
        
        const response = await ContentService.getRegionStructure('central');
        console.log('📥 استجابة بيانات المنطقة:', response);
        


        if (response.success) {
          const processedData = processImageUrls(response.data);
          setRegionData(processedData);
          console.log('✅ تم تحميل بيانات المنطقة الوسطى بنجاح');
        } else {
          throw new Error(response.message || 'فشل في جلب البيانات');
        }
      } catch (err) {
        console.error('❌ خطأ في جلب بيانات المنطقة:', err);
        setError('فشل في تحميل بيانات المنطقة');
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
  }, []);

  // تحميل حالة التصويت لجميع المحتويات
  const loadVotesStatus = async (data: RegionData) => {
    if (!currentUserId) {
      console.log('⚠️ لا يوجد مستخدم، تخطي تحميل حالة التصويت');
      return;
    }

    try {
      // جمع جميع معرفات المحتوى
      const allContentIds = [
        ...data.heritageSites.map(item => item.id),
        ...data.intangibleHeritage.oral.map(item => item.id),
        ...data.intangibleHeritage.folklore.map(item => item.id),
        ...data.intangibleHeritage.crafts.map(item => item.id),
        ...data.clothing.men.map(item => item.id),
        ...data.clothing.women.map(item => item.id),
        ...data.clothing.boys.map(item => item.id),
        ...data.clothing.girls.map(item => item.id),
        ...data.food.map(item => item.id)
      ].filter(id => id);

      console.log('🔄 تحميل حالة التصويت للمحتوى:', allContentIds);

      if (allContentIds.length > 0) {
        const statusResponse = await VoteService.getVotesStatus(currentUserId, allContentIds);
        if (statusResponse.success) {
          setVotedContents(new Set(statusResponse.data.votedContentIds));
          console.log('✅ تم تحميل حالة التصويت:', statusResponse.data.votedContentIds);
        }
      }

      // تحميل عدد التصويتات لكل محتوى
      for (const contentId of allContentIds) {
        try {
          const votesResponse = await VoteService.getContentVotes(contentId);
          if (votesResponse.success) {
            setVotesCount(prev => ({
              ...prev,
              [contentId]: votesResponse.data.votesCount
            }));
          }
        } catch (error) {
          console.error(`❌ خطأ في جلب تصويتات المحتوى ${contentId}:`, error);
        }
      }

    } catch (error) {
      console.error('❌ خطأ في تحميل حالة التصويت:', error);
    }
  };

  // تحميل حالة قائمة الأمنيات
  const loadWishlistStatus = async (data: RegionData) => {
    if (!currentUserId) {
      console.log('⚠️ لا يوجد مستخدم، تخطي تحميل حالة الأمنيات');
      return;
    }

    try {
      const allContentIds = [
        ...data.heritageSites.map(item => item.id),
        ...data.intangibleHeritage.oral.map(item => item.id),
        ...data.intangibleHeritage.folklore.map(item => item.id),
        ...data.intangibleHeritage.crafts.map(item => item.id),
        ...data.clothing.men.map(item => item.id),
        ...data.clothing.women.map(item => item.id),
        ...data.clothing.boys.map(item => item.id),
        ...data.clothing.girls.map(item => item.id),
        ...data.food.map(item => item.id)
      ].filter(id => id);

      console.log('🔄 تحميل حالة الأمنيات للمحتوى:', allContentIds);

      if (allContentIds.length > 0) {
        const statusResponse = await WishlistService.getWishlistStatus(currentUserId, allContentIds);
        if (statusResponse.success) {
          setWishlistedContents(new Set(statusResponse.data.wishlistedContentIds));
          console.log('✅ تم تحميل حالة الأمنيات:', statusResponse.data.wishlistedContentIds);
        }
      }

      // تحميل عدد العناصر في قائمة الأمنيات من الباك إند
      const countResponse = await WishlistService.getWishlistCount(currentUserId);
      if (countResponse.success) {
        setWishlistCount(countResponse.data.count);
        console.log('✅ عدد العناصر في الأمنيات:', countResponse.data.count);
      }

    } catch (error) {
      console.error('❌ خطأ في تحميل حالة الأمنيات:', error);
    }
  };

  // تحميل حالة التصويت والأمنيات عند تحميل البيانات
  useEffect(() => {
    if (regionData && currentUserId) {
      console.log('🔄 بدء تحميل حالات التصويت والأمنيات...');
      loadVotesStatus(regionData);
      loadWishlistStatus(regionData);
    }
  }, [regionData, currentUserId]);

  // دالة التصويت
  const handleVote = async (contentId: string) => {

    
    const userId = localStorage.getItem('userId') || currentUserId;
    console.log('🎯 بدء التصويت:', { userId, contentId });
    
    try {
      const response = await VoteService.addVote(userId, contentId);
      console.log('📥 استجابة التصويت:', response);
      
      if (response.success) {
        // إخفاء زر التصويت لهذا المحتوى مباشرة
        setVotedContents(prev => new Set(prev.add(contentId)));
        
        // تحديث عدد التصويتات
        const newVotesCount = response.data.votesCount;
        setVotesCount(prev => ({
          ...prev,
          [contentId]: newVotesCount
        }));

        // تحديث votesCount في regionData
        setRegionData(prev => {
          if (!prev) return prev;
          
          const updateContentVotes = (content: ContentItem) => 
            content.id === contentId 
              ? { ...content, votesCount: newVotesCount }
              : content;

          return {
            ...prev,
            heritageSites: prev.heritageSites.map(updateContentVotes),
            intangibleHeritage: {
              oral: prev.intangibleHeritage.oral.map(updateContentVotes),
              folklore: prev.intangibleHeritage.folklore.map(updateContentVotes),
              crafts: prev.intangibleHeritage.crafts.map(updateContentVotes)
            },
            clothing: {
              men: prev.clothing.men.map(updateContentVotes),
              women: prev.clothing.women.map(updateContentVotes),
              boys: prev.clothing.boys.map(updateContentVotes),
              girls: prev.clothing.girls.map(updateContentVotes)
            },
            food: prev.food.map(updateContentVotes)
          };
        });

        console.log('✅ تم التصويت بنجاح!');
        alert('تم التصويت بنجاح!');
      }
    } catch (error: any) {
      console.error('❌ خطأ في التصويت:', error);
      if (error.message?.includes("لقد قمت بالتصويت لهذا المحتوى مسبقاً")) {
        setVotedContents(prev => new Set(prev.add(contentId)));
        alert('لقد قمت بالتصويت لهذا المحتوى مسبقاً');
      } else {
        alert(error.message || 'حدث خطأ أثناء التصويت');
      }
    }
  };

  // دالة إضافة/إزالة من قائمة الأمنيات
  const handleWishlist = async (contentId: string) => {


    const userId = localStorage.getItem('userId') || currentUserId;
    console.log('🎯 إدارة الأمنيات:', { userId, contentId, isCurrentlyWishlisted: wishlistedContents.has(contentId) });
    
    try {
      if (wishlistedContents.has(contentId)) {
        // إزالة من قائمة الأمنيات
        console.log('🔄 إزالة من الأمنيات...');
        const response = await WishlistService.removeFromWishlist(userId, contentId);
        console.log('📥 استجابة الإزالة:', response);
        
        if (response.success) {
          setWishlistedContents(prev => {
            const newSet = new Set(prev);
            newSet.delete(contentId);
            return newSet;
          });
          // تحديث العدد من الباك إند
          const countResponse = await WishlistService.getWishlistCount(userId);
          if (countResponse.success) {
            setWishlistCount(countResponse.data.count);
          }
          alert('تمت الإزالة من قائمة الأمنيات');
        }
      } else {
        // إضافة إلى قائمة الأمنيات
        console.log('🔄 إضافة إلى الأمنيات...');
        const response = await WishlistService.addToWishlist(userId, contentId);
        console.log('📥 استجابة الإضافة:', response);
        
        if (response.success) {
          setWishlistedContents(prev => new Set(prev.add(contentId)));
          // تحديث العدد من الباك إند
          const countResponse = await WishlistService.getWishlistCount(userId);
          if (countResponse.success) {
            setWishlistCount(countResponse.data.count);
          }
          alert('تمت الإضافة إلى قائمة الأمنيات');
        }
      }
    } catch (error: any) {
      console.error('❌ خطأ في إدارة الأمنيات:', error);
      alert(error.message || 'حدث خطأ أثناء إدارة قائمة الأمنيات');
    }
  };

  // دالة لعرض البطاقة مع أزرار التصويت والأمنيات
  const renderItemCard = (item: ContentItem, showVoteButton: boolean = true, showWishlistButton: boolean = true) => (
    <div key={item.id} className="item-card">
      <a href={item.googlemapsurl} target="_blank" rel="noopener noreferrer">
        <div className="item-image">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.title}
              onError={handleImageError}
            />
          ) : null}
          <div className={`image-placeholder ${item.imageUrl ? 'hidden' : ''}`}>
            <MapPin size={40} />
          </div>
        </div>
      </a>
      <div className="item-info">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        
        <div className="card-actions">
          {/* زر التصويت */}
          {showVoteButton && !votedContents.has(item.id) && (
            <button 
              className="vote-button"
              onClick={() => handleVote(item.id)}
      
            >
              <Heart size={20} fill="none" color="gray" />
              <span> احببته ({item.votesCount})</span>
            </button>
          )}

          {/* رسالة نجاح التصويت */}
          {showVoteButton && votedContents.has(item.id) && (
            <div className="vote-success-message">
              <Heart size={16} fill="red" color="red" />
              <span>تم التصويت ({item.votesCount})</span>
            </div>
          )}

          {/* زر قائمة الأمنيات - للأماكن التراثية فقط */}
          {showWishlistButton && activeTab === 'heritage' && (
            <button 
              className={`wishlist-button ${wishlistedContents.has(item.id) ? 'in-wishlist' : ''}`}
              onClick={() => handleWishlist(item.id)}
        
            >
              {wishlistedContents.has(item.id) ? (
                <>
                  <BookmarkCheck size={18} fill="currentColor" />
                  <span>في قائمة الأمنيات</span>
                </>
              ) : (
                <>
                  <Bookmark size={18} />
                  <span>أضف إلى الأمنيات</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // دالة خاصة لعرض بطاقات الملابس بنفس تصميم المنطقة الشمالية
  const renderClothingCard = (item: ContentItem) => (
    <div key={item.id} className="clothing-item-reverse">
      {/* النص على اليمين */}
      <div className="clothing-text">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        
        <div className="card-actions">
          {/* زر التصويت */}
          {!votedContents.has(item.id) && (
            <button 
              className="vote-button"
              onClick={() => handleVote(item.id)}
           
            >
              <Heart size={20} fill="none" color="gray" />
              <span> احببته ({item.votesCount})</span>
            </button>
          )}

          {/* رسالة نجاح التصويت */}
          {votedContents.has(item.id) && (
            <div className="vote-success-message">
              <Heart size={16} fill="red" color="red" />
              <span>تم التصويت ({item.votesCount})</span>
            </div>
          )}
        </div>
      </div>

      {/* المودل 3D على اليسار */}
      <div className="clothing-model">
        {item.model3d ? (
          <model-viewer
            src={item.model3d}
            alt={item.title}
            camera-controls
            auto-rotate
            camera-orbit="0deg 75deg 105%"
            environment-image="neutral"
            shadow-intensity="1"
            style={{ 
              width: '100%', 
              height: '400px',
              borderRadius: '15px',
              background: '#f8f9fa'
            }}
          ></model-viewer>
        ) : (
          <div className="model-placeholder">
            <Shirt size={60} />
            <p>لا يوجد نموذج متاح</p>
          </div>
        )}
      </div>
    </div>
  );

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


  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const placeholder = target.nextElementSibling as HTMLElement;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  // بيانات افتراضية
  const defaultRegionData: RegionData = {
    name: 'المنطقة الوسطى',
    description: '',
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

  // استخدام البيانات الفعلية أو الافتراضية
  const data = regionData || defaultRegionData;

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

  return (
    <div className="region-page">
      <Header />

      {/* رأس الصفحة */}
      <header className="region-header">
        <div className="header-content pt-20">
          <h1 className="region-title">المنطقة الوسطى</h1>
          <p className="region-description">
            تُعد المنطقة الوسطى (نجد) قلب المملكة العربية السعودية النابض، ومهد تاريخها المجيد، حيث تجسد الأصالة النجدية الأصيلة وروح البداوة المتجذرة.
            تضم المنطقة العاصمة الرياض والقصيم، وتزخر بتراث عريق تتجلى ملامحه في القصور التاريخية كقصر المصمك، والرقصات الشعبية كالعرضة النجدية التي تعبر عن الهوية والانتماء.
            أصبحت في العصر الحديث قِبلة سياحية وثقافية بارزة، حيث تجمع بين المتاحف كمتْحف الملك عبدالعزيز والمعالم العمرانية الحديثة.
            تبقى نجد رمزًا للتوازن الفريد بين إرث الماضي العريق وحيوية الحاضر، لتعكس بذلك الهوية السعودية الأصيلة في أبهى صورها.
          </p>
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
            <div className="heritage-header">
              <h2>الأماكن التراثية والأثرية</h2>
              { (
                <div className="wishlist-info">
                  <Link href="/Wishlist" className="wishlist-link">
                    <span className="wishlist-count">
                      قائمة الامنيات
                    </span>
                  </Link>
                </div>
              )}
            </div>
            {data.heritageSites.length === 0 ? (
              <div className="empty-state">
                <p>لا توجد أماكن تراثية متاحة حالياً</p>
              </div>
            ) : (
              <div className="items-grid">
                {data.heritageSites.map((site, index) => (
                  renderItemCard(site, true, true)
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
                    renderItemCard(item, true, false)
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

                <div className="clothing-items-container">
                  {data.clothing[selectedCategory as keyof typeof data.clothing]?.map((item, index) => (
                    renderClothingCard(item)
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
                  renderItemCard(item, true, false)
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CentralRegionPage;

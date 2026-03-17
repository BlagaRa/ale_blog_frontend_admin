'use client'
import { useBookStore, Gen } from '@/store/booksStore'; // Asigură-te că imporți Gen
import { BookOpen, Edit, Trash2, Plus, X, Save, Ban } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

function Page() {
  const { books, getBooks, isLoading, deleteBook, editBook, addReview, updateReview, deleteReview } = useBookStore();
  
  const searchParams = useSearchParams();
  const currentBookId = searchParams.get('bookId') || null;
  const currentBook = books.find(book => book.id === currentBookId);
  const router = useRouter();

  const [isEditingBook, setIsEditingBook] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  
  const [reviewDraft, setReviewDraft] = useState({ description: '', stars: 0 });
  const [bookDraftImage, setBookDraftImage] = useState<File | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);

  useEffect(() => {
    if (books.length === 0) getBooks();
  }, [books.length, getBooks]);

  useEffect(() => {
    if (!isLoading && books.length > 0 && !currentBook) router.push('/blog'); 
  }, [currentBook, isLoading, books.length, router]);

  // --- Handlere Ștergere ---
  const handleDeleteBook = async () => {
    if (!currentBook) return;
    if (window.confirm('Ești sigur că vrei să ștergi această carte?')) {
      const success = await deleteBook(currentBook.id);
      if (success) router.push('/blog');
    }
  };

  const handleDeleteReview = async () => {
    if (!currentBook || !currentBook.review) return;
    if (window.confirm('Ești sigur că vrei să ștergi recenzia?')) {
      await deleteReview(currentBook.review.id);
    }
  };

  // --- Handlere Salvare ---
  const handleAddReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentBook) return;
    const formData = new FormData(e.currentTarget);
    const description = formData.get('description') as string;
    const stars = Number(formData.get('stars'));

    const success = await addReview(currentBook.id, { description, stars });
    if (success) setIsAddReviewModalOpen(false);
  };

  const handleSaveEditedReview = async () => {
    if (!currentBook || !currentBook.review) return;
    const success = await updateReview(currentBook.review.id, reviewDraft);
    if (success) setIsEditingReview(false);
  };

  const handleSaveBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentBook) return;
    
    const formData = new FormData(e.currentTarget);
    const success = await editBook(currentBook.id, formData);
    if (success) {
      setIsEditingBook(false);
      setBookDraftImage(null);
    }
  };

  if (isLoading || (books.length === 0 && !currentBook)) {
    return <div className='mt-20 p-10 font-sans text-center'>Se încarcă detaliile...</div>;
  }

  if (!currentBook) return null;

  return (
    <>
      {isAddReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="bg-bfirst border-2 border-accent w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative">
            <button onClick={() => setIsAddReviewModalOpen(false)} className="absolute top-4 right-4 p-2 cursor-pointer hover:text-accent">
              <X size={24} />
            </button>
            <h2 className="font-serif text-3xl mb-6 text-center">Add new review</h2>
            <form onSubmit={handleAddReviewSubmit} className="grid grid-cols-1 gap-4 font-lora">
              <input name="stars" type="number" min="1" max="5" placeholder="Stars (1-5)" className="p-3 border-2 border-accent rounded-xl bg-transparent outline-none" required />
              <textarea name="description" placeholder="Review Description" className="p-3 border-2 border-accent rounded-xl bg-transparent outline-none h-32" required></textarea>
              <button type="submit" className="mt-4 bg-accent text-bfirst font-bold py-3 rounded-xl hover:bg-bfirst hover:text-accent border-2 border-transparent hover:border-accent cursor-pointer transition-all">
                {isLoading ? "Saving..." : "Create Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className={`mt-20 flex flex-col md:flex-row gap-10 justify-center align-center bg-bsecond transition-all duration-300 ${isAddReviewModalOpen ? 'blur-md' : ''}`}>
        
        <form 
          onSubmit={handleSaveBook}
          className={`flex-1 ${isEditingBook ? 'bg-bfirst border-accent shadow-lg' : 'bg-accent'} w-full border-r-2 border-t-2 flex flex-col items-center p-4 transition-all duration-300`}
        >
          <div className='flex flex-row justify-between w-full mb-4'>
            <p className='font-lora opacity-60 text-sm flex items-center'>Posted on: {new Date(currentBook.createdAt).toLocaleDateString()}</p>
            {isEditingBook ? (
              <select name="gen" defaultValue={currentBook.gen} className="p-1 border-2 border-accent rounded-xl bg-transparent outline-none font-bold">
                {Object.values(Gen).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            ) : (
              <p className='self-end text-right bg-highli font-bold rounded-lg px-2 border-2 font-sans'>{currentBook.gen}</p>
            )}
          </div>
          
          {isEditingBook ? (
            <input name="title" defaultValue={currentBook.title} placeholder="Book Title" className="font-serif text-3xl mb-4 font-bold text-center border-b-2 border-accent bg-transparent outline-none w-full" required />
          ) : (
            <h1 className='font-serif text-4xl mb-2 font-bold'>{currentBook.title}</h1>
          )}

          <div 
            className={`relative mb-3 ${isEditingBook ? 'cursor-pointer group' : ''}`}
            onClick={() => isEditingBook && imageInputRef.current?.click()}
          >
            <Image
              src={bookDraftImage ? URL.createObjectURL(bookDraftImage) : (currentBook.image || '/contact.jpg')}
              alt="logo"
              width={290}
              height={100}
              className={`object-contain border-4 border-highli ${isEditingBook ? 'group-hover:opacity-50 transition-opacity' : ''}`} 
              priority
            />
            {isEditingBook && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-accent text-bfirst px-4 py-2 rounded-xl font-bold border-2 border-bfirst">Change Cover</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            name="image" 
            accept="image/*" 
            ref={imageInputRef} 
            className="hidden" 
            onChange={(e) => { if(e.target.files && e.target.files[0]) setBookDraftImage(e.target.files[0]); }} 
          />

          {!isEditingBook && (
            <div className='flex flex-row gap-1'>
              {[...Array(5)].map((_, index) => {
                const isFilled = currentBook && currentBook.review && index < currentBook.review.stars;
                return <BookOpen key={index} size={24} className={`${isFilled ? 'text-highli' : 'text-black opacity-80'} transition-colors duration-300`} />
              })}
            </div>
          )}
          
          {isEditingBook ? (
            <textarea name="description" defaultValue={currentBook.description} placeholder="Book Description" className="w-full text-sm p-4 italic font-lora border-2 border-accent rounded-xl bg-transparent outline-none mt-4 h-32" required />
          ) : (
            <p className='text-sm text-center p-4 italic font-lora'>&quot;{currentBook.description}&quot;</p>
          )}

          {isEditingBook ? (
            <input name="author" defaultValue={currentBook.author} placeholder="Author" className="font-lora text-md text-right pr-4 w-full font-bold border-b-2 border-accent bg-transparent outline-none mt-4 mb-4" required />
          ) : (
            <p className='font-lora text-md text-right pr-4 w-full font-bold'>{currentBook.author}</p>
          )}

          {isEditingBook ? (
            <div className="w-full self-start flex gap-2 items-center mb-6">
              <label className="font-lora text-sm opacity-80">Published in:</label>
              <input name="writtenAt" type="date" defaultValue={new Date(currentBook.writtenAt).toISOString().split('T')[0]} className="p-1 border-2 border-accent rounded-xl bg-transparent outline-none text-sm" required />
            </div>
          ) : (
            <p className='self-start font-lora text-sm opacity-80 mb-6'>Published in: {new Date(currentBook.writtenAt).toLocaleDateString()}</p>
          )}

          {/* Butoane Acțiune Carte */}
          <div className='flex flex-row gap-4 mt-auto w-full justify-center'>
            {isEditingBook ? (
              <>
                <button type="submit" className='font-lora flex items-center gap-2 bg-green-600 border-2 border-transparent px-4 py-2 rounded-xl text-white cursor-pointer hover:bg-white hover:text-green-600 hover:border-green-600 transition-all'>
                  <Save size={18} /> Save
                </button>
                <button type="button" onClick={() => {setIsEditingBook(false); setBookDraftImage(null);}} className='font-lora flex items-center gap-2 bg-gray-500 border-2 border-transparent px-4 py-2 rounded-xl text-white cursor-pointer hover:bg-white hover:text-gray-500 hover:border-gray-500 transition-all'>
                  <Ban size={18} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setIsEditingBook(true)} className='font-lora flex items-center gap-2 bg-bfirst border-2 border-accent px-4 py-2 rounded-xl text-accent cursor-pointer hover:bg-accent hover:text-bfirst transition-all'>
                  <Edit size={18} /> Edit Book
                </button>
                <button type="button" onClick={handleDeleteBook} className='font-lora flex items-center gap-2 bg-red-600 border-2 border-transparent px-4 py-2 rounded-xl text-white cursor-pointer hover:bg-white hover:text-red-600 hover:border-red-600 transition-all'>
                  <Trash2 size={18} /> Delete Book
                </button>
              </>
            )}
          </div>
        </form>

        {/* PARTEA DREAPTĂ: Recenzie */}
        <div className='flex-2 w-full p-10 flex flex-col items-center'>
          <h1 className='font-bold text-3xl lg:text-5xl font-lora text-center'>{currentBook.title}</h1>
          <p className='self-end text-xl italic font-lora mb-10'>By {currentBook.author}</p>
          
          {currentBook.review ? (
            <div className="w-full flex flex-col items-center">
              {isEditingReview ? (
                // --- STAREA DE EDITARE RECENZIE INLINE ---
                <div className="w-full flex flex-col items-center gap-6 bg-bfirst p-6 rounded-2xl border-2 border-accent shadow-md">
                  {/* Stelele interactive (Clickable Books) */}
                  <div className='flex flex-row gap-2'>
                    {[...Array(5)].map((_, index) => (
                      <BookOpen 
                        key={index} 
                        size={32} 
                        onClick={() => setReviewDraft({...reviewDraft, stars: index + 1})}
                        className={`cursor-pointer transition-colors duration-300 hover:scale-110 ${
                          index < reviewDraft.stars ? 'text-highli' : 'text-gray-300 opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <textarea 
                    value={reviewDraft.description}
                    onChange={(e) => setReviewDraft({...reviewDraft, description: e.target.value})}
                    className="w-full p-4 border-2 border-accent rounded-xl bg-transparent outline-none min-h-[150px] font-lora"
                  />
                  
                  <div className='flex flex-row gap-4'>
                    <button onClick={handleSaveEditedReview} className='font-lora flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-white hover:text-green-600 border-2 border-transparent hover:border-green-600 transition-all'>
                      <Save size={18} /> Save Review
                    </button>
                    <button onClick={() => setIsEditingReview(false)} className='font-lora flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-white hover:text-gray-500 border-2 border-transparent hover:border-gray-500 transition-all'>
                      <Ban size={18} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // --- STAREA DE VIZUALIZARE RECENZIE ---
                <div className="w-full flex flex-col">
                  <p className='font-lora text-md leading-relaxed text-justify'>
                    {currentBook.review.description}
                  </p>
                  
                  {/* Butoane Acțiune Recenzie */}
                  <div className='flex flex-row gap-6 mt-10 justify-center border-t-2 border-accent/20 pt-6'>
                    <button 
                      onClick={() => {
                        setReviewDraft({ description: currentBook.review!.description, stars: currentBook.review!.stars });
                        setIsEditingReview(true);
                      }}
                      className='font-lora flex items-center gap-2 text-accent cursor-pointer hover:opacity-70 transition-all font-bold'
                    >
                      <Edit size={18} /> Edit Review
                    </button>
                    <button 
                      onClick={handleDeleteReview}
                      className='font-lora flex items-center gap-2 text-red-600 cursor-pointer hover:opacity-70 transition-all font-bold'
                    >
                      <Trash2 size={18} /> Delete Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 mt-10">
              <p className='font-lora text-md text-center'>
                I am sorry but this book does not have a review yet!
              </p>
              <button 
                onClick={() => setIsAddReviewModalOpen(true)}
                className='font-lora flex items-center gap-2 bg-accent border-2 border-bfirst px-6 py-3 rounded-2xl text-bfirst cursor-pointer hover:bg-bfirst hover:text-accent hover:border-accent transition-all'
              >
                Add new review
                <Plus size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Page;
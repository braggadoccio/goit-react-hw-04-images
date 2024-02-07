import { useState, useEffect } from 'react';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { SearchBar } from './SearchBar/SearchBar';
import { Loader } from './Loader/Loader';
import css from './App.module.css';
import { getAPI } from '../pixabay-api';
import toast, { Toaster } from 'react-hot-toast';

export const App = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  // componentDidUpdate = async (_prevProps, prevState) => {
  //   const { search, page } = this.state;

  //   if (prevState.search !== search || prevState.page !== page) {
  //     await this.fetchImages(search, page);
  //   }
  // };
  useEffect(() => {
    if (search === '') return;
    (async () => {
      await fetchImages(search, page);
    })();

    // return () => {};
  }, [search, page]);

  const fetchImages = async (search, page) => {
    try {
      setIsLoading(true);
      const fetchedImages = await getAPI(search, page);
      const { hits, totalHits } = fetchedImages;

      // console.log(hits, totalHits);

      if (hits.length === 0) {
        toast.error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      if (page === 1) {
        toast.success(`Hooray! We found ${totalHits} images`);
      }

      if (page * 12 >= totalHits) {
        setIsEnd(true);
        toast("We're sorry, but you've reached the end of search results.");
      }

      setImages(prevImages => [...prevImages, ...hits]);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    // const { search } = this.state;
    const newSearch = e.target.search.value.trim().toLowerCase();

    if (newSearch !== search) {
      setSearch(newSearch);
      setPage(1);
      setImages([]);
    }
  };

  const handleClick = () => {
    // this.setState(prevState => ({ page: prevState.page + 1 }));
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      {images.length >= 1 && <ImageGallery photos={images} />}
      {images.length >= 1 && !isEnd && <Button onClick={handleClick} />}
      {isLoading && <Loader />}
      {isError && toast.error('Opps, something went wrong! Reload this page!')}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

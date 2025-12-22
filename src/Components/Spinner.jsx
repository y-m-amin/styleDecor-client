import { PuffLoader } from 'react-spinners';

function Spinner() {
  return (
    <div className='sweet-loading mx-auto flex justify-center items-center h-2/3'>
      <PuffLoader color='#3ce8e5' size={80} />
      {/* <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label='Loading Spinner'
        data-testid='loader'
      /> */}
    </div>
  );
}

export default Spinner;

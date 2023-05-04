import { FC, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import './style/index.scss';
interface SliderProps {
  value?: number;
  max: number;
  min: number;
  step?: number;
  className?: string;
  offset?: number;
  onChange?: (value: number) => void;
}
const Slider: FC<SliderProps> = (props) => {
  const { value, max, min, step = 1, offset = 0, className, onChange } = props;
  const [val, setVal] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackWidth = useRef(0);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(event.target.value);
    setVal(num);
    calcTrackWidth(num);
    onChange?.(num);
  };

  const calcTrackWidth = (val: number) => {
    const slider = sliderRef.current;
    if (slider) {
      const { width } = slider.getBoundingClientRect();
      const percent = val / (max - min);
      trackWidth.current = Math.floor(percent * width) - (16 + offset);
    }
  };

  useEffect(() => {
    if (value) {
      setVal(value);
      calcTrackWidth(value);
    }
  }, [value]);

  return (
    <div ref={sliderRef} className={classNames('cy-slider', className)}>
      <input type="range" value={val} min={min} max={max} step={step} onChange={changeHandler} />
      <div className={classNames('cy-slider__track')} style={{ width: `${trackWidth.current}px` }}></div>
    </div>
  );
};

export default Slider;

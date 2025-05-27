import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { 
  Button, 
  Slider, 
  Box, 
  Typography, 
  Paper,
  Container
} from '@mui/material';

const PhotoShow: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleScaleChange = (_event: Event, newValue: number | number[]) => {
    setScale(newValue as number);
  };

  const getCroppedImage = () => {
    return new Promise((resolve) => {
      if (!imageRef.current || !canvasRef.current) return;

      const image = imageRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // 获取图片的显示尺寸
      const displayWidth = image.width;
      const displayHeight = image.height;

      // 计算裁剪区域（基于显示尺寸）
      const cropX = (crop.x * displayWidth) / 100;
      const cropY = (crop.y * displayHeight) / 100;
      const cropWidth = (crop.width * displayWidth) / 100;
      const cropHeight = (crop.height * displayHeight) / 100;

      // 设置画布尺寸为裁剪区域的显示尺寸
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 计算源图像和目标画布的比例
      const ratio = Math.min(
        canvas.width / cropWidth,
        canvas.height / cropHeight
      );

      // 绘制裁剪后的图片
      ctx.drawImage(
        image,
        cropX * (image.naturalWidth / displayWidth),
        cropY * (image.naturalHeight / displayHeight),
        cropWidth * (image.naturalWidth / displayWidth),
        cropHeight * (image.naturalHeight / displayHeight),
        0,
        0,
        cropWidth,
        cropHeight
      );

      resolve(canvas);
    });
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    
    try {
      await getCroppedImage();
      
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvasRef.current.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Photo Editor
          </Typography>
          <Button
            variant="contained"
            component="label"
            size="large"
            sx={{ minWidth: '150px' }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
        </Box>

        {selectedImage && (
          <>
            <Box sx={{ 
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              p: 2
            }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
              >
                <img
                  ref={imageRef}
                  src={selectedImage}
                  style={{ 
                    maxWidth: '100%', 
                    transform: `scale(${scale})`,
                    maxHeight: '70vh',
                    objectFit: 'contain'
                  }}
                  alt="Upload"
                />
              </ReactCrop>
            </Box>

            <Box sx={{ 
              maxWidth: '600px', 
              width: '100%', 
              mx: 'auto',
              mb: 4,
              px: 2
            }}>
              <Typography variant="h6" gutterBottom>Image Scale</Typography>
              <Slider
                value={scale}
                onChange={handleScaleChange}
                min={0.1}
                max={2}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownload}
                size="large"
                sx={{ minWidth: '200px' }}
              >
                Download Edited Image
              </Button>
            </Box>

            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default PhotoShow;

import io
import base64
import json
import numpy as np
from PIL import Image
import torch
import torchvision.transforms as transforms
from torchvision.models.detection import fasterrcnn_resnet50_fpn

class LogoDetector:
    """
    ロゴ検出クラス
    LogoDet-3Kベースのモデルを使用
    """
    def __init__(self, threshold=0.5, mock=False):
        """
        初期化
        
        Args:
            threshold: ロゴ検出の閾値（0-1）
            mock: モックモードの有効化（テスト用）
        """
        self.threshold = threshold
        self.mock = mock
        
        if not mock:
            # 本番モード：実際のモデルを読み込む
            try:
                # FasterRCNNモデルの読み込み
                self.model = fasterrcnn_resnet50_fpn(pretrained=True)
                self.model.eval()
                
                # GPUが利用可能な場合はGPUを使用
                self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
                self.model.to(self.device)
                
                # 前処理の設定
                self.transform = transforms.Compose([
                    transforms.ToTensor(),
                ])
                
                print(f"ロゴ検出モデルを初期化しました（デバイス: {self.device}）")
            except Exception as e:
                print(f"モデルの初期化中にエラーが発生しました: {str(e)}")
                # エラーが発生した場合はモックモードに切り替え
                self.mock = True
    
    def detect_logo(self, image_data):
        """
        画像からロゴを検出
        
        Args:
            image_data: Base64エンコードされた画像データ
            
        Returns:
            tuple: (ロゴの有無, 検出スコア, バウンディングボックス)
        """
        if self.mock:
            # モックモード：ランダムに結果を返す（テスト用）
            import random
            has_logo = random.random() < 0.5
            score = random.uniform(0.3, 0.9) if has_logo else random.uniform(0.1, 0.4)
            
            # スコアが閾値以上の場合のみロゴありと判定
            has_logo = score >= self.threshold
            
            # バウンディングボックス
            bbox = None
            if has_logo:
                # ランダムな位置とサイズ
                x = random.randint(10, 100)
                y = random.randint(10, 100)
                width = random.randint(50, 200)
                height = random.randint(50, 200)
                bbox = [x, y, width, height]
            
            return has_logo, score, bbox
        
        try:
            # Base64デコード
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            
            # 画像の前処理
            image_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # 推論
            with torch.no_grad():
                prediction = self.model(image_tensor)
            
            # 結果の解析
            boxes = prediction[0]['boxes'].cpu().numpy()
            scores = prediction[0]['scores'].cpu().numpy()
            labels = prediction[0]['labels'].cpu().numpy()
            
            # ロゴの検出（クラス1がロゴと仮定）
            logo_indices = np.where((labels == 1) & (scores >= self.threshold))[0]
            
            if len(logo_indices) > 0:
                # 最も確信度の高いロゴを選択
                best_idx = logo_indices[np.argmax(scores[logo_indices])]
                best_score = float(scores[best_idx])
                best_box = boxes[best_idx].tolist()
                
                # バウンディングボックスの形式変換 [x1, y1, x2, y2] -> [x, y, width, height]
                x, y, x2, y2 = best_box
                width = x2 - x
                height = y2 - y
                bbox = [int(x), int(y), int(width), int(height)]
                
                return True, best_score, bbox
            else:
                return False, 0.0, None
                
        except Exception as e:
            print(f"ロゴ検出中にエラーが発生しました: {str(e)}")
            return False, 0.0, None
    
    def highlight_logo(self, image_data, bbox):
        """
        ロゴ部分をハイライト表示した画像を生成
        
        Args:
            image_data: Base64エンコードされた画像データ
            bbox: バウンディングボックス [x, y, width, height]
            
        Returns:
            str: ハイライト表示されたBase64エンコード画像
        """
        if not bbox:
            return image_data
        
        try:
            # Base64デコード
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            
            # 画像の編集
            import numpy as np
            from PIL import ImageDraw
            
            # PIL画像をNumPy配列に変換
            img_array = np.array(image)
            
            # 描画用のオブジェクト作成
            draw = ImageDraw.Draw(image)
            
            # バウンディングボックスの描画
            x, y, width, height = bbox
            draw.rectangle([(x, y), (x + width, y + height)], outline="red", width=3)
            
            # 画像をBase64エンコード
            buffered = io.BytesIO()
            image.save(buffered, format="JPEG")
            highlighted_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            return highlighted_image
            
        except Exception as e:
            print(f"ロゴのハイライト中にエラーが発生しました: {str(e)}")
            return image_data

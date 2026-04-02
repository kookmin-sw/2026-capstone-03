import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Camera, User } from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function ProfileSettings() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    setName(user.name || '');
    setEmail(user.email || '');
    setPreviewImage(user.profileImage || '');
  }, [navigate]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('로그인 정보가 없습니다.');
      return;
    }

    const existingUser = JSON.parse(userStr);

    const updatedUser = {
      ...existingUser,
      name,
      email,
      // 현재는 프론트 임시 저장
      // 실제 서버 연동 시 여기 대신 업로드 후 URL 저장
      profileImage: previewImage,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success('프로필이 변경되었습니다.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">프로필 수정</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>내 정보</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="프로필 미리보기"
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      <User className="w-10 h-10" />
                    </div>
                  )}

                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                </div>

                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <p className="text-sm text-gray-500">
                  프로필 이미지를 변경할 수 있습니다
                </p>
                {selectedFile && (
                  <p className="text-xs text-gray-400">{selectedFile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름 입력"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 입력"
                />
              </div>

              <Button type="submit" className="w-full">
                저장하기
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
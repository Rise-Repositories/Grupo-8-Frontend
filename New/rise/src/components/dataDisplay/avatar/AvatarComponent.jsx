import React, { useEffect, useState } from 'react';
import { Avatar as AntAvatar } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import UploadAvatarModal from '../../modals/updateAvatarModal/UpdateAvatarModal';
import api from '../../../api';

const AvatarComponent = ({ size }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [userId, setUserId] = useState(null);

    const handleAvatarClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleAvatarUpdate = (newAvatarUrl) => {
        setAvatarUrl(newAvatarUrl);
    };
    
    useEffect(() => {

        const fetchUserAccount = async () => {
            try {
                const token = sessionStorage.getItem('USER_TOKEN');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };

                const accountResponse = await api.get('/user/account', { headers });
                const userId = accountResponse.data.id;
                setUserId(userId);

                const avatarResponse = await api.get(`/user/file/${userId}`, { headers, responseType: 'arraybuffer' });
                const imageBlob = new Blob([avatarResponse.data], { type: 'image/png' });
                const imageUrl = URL.createObjectURL(imageBlob);

                setAvatarUrl(imageUrl);
            } catch (error) {
                console.error('Erro ao buscar os dados do usuário:', error);
            }
        };

        fetchUserAccount();
    }, []);

    return (
        <>
            <h3 style={{ position: 'relative', display: 'inline-block' }}>
                <AntAvatar
                    src={avatarUrl}
                    icon={!avatarUrl && <UserOutlined />}
                    size={size}
                    style={{ cursor: 'pointer' }}
                    onClick={handleAvatarClick}
                />
                <EditOutlined
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 10,
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        padding: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.3s, background-color 0.3s, box-shadow 0.3s'
                    }}
                    onClick={handleAvatarClick}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e6f7ff';
                        e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.15)';
                        e.currentTarget.style.transform = 'scale(1.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                />
            </h3>

            <UploadAvatarModal
                visible={isModalOpen}
                onClose={handleModalClose}
                userId={userId}
                onAvatarUpdate={handleAvatarUpdate}
            />
        </>
    );
};

export default AvatarComponent;

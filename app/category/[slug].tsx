import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Document } from "@/types/document";
import { DocumentService } from "@/services/documentService";
import DocumentCard from "@/components/document/DocumentCard";

export default function CategoryScreen() {
    const { slug, name } = useLocalSearchParams();
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                const response = await DocumentService.getDocumentByCategory({
                    page: 1,
                    limit: 20,
                    slug: slug as string,
                });
                setDocuments(response.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh sách tài liệu");
                console.error("Error fetching documents:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [slug]);

    const handleDocumentPress = (document: Document) => {
        router.push({
            pathname: "/document/[id]",
            params: { id: document.id }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{name as string}</Text>
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <Text>Đang tải...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.retryText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            ) : documents.length > 0 ? (
                <FlatList
                    data={documents}
                    renderItem={({ item }) => (
                        <DocumentCard document={item} onPress={handleDocumentPress} />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                />
            ) : (
                <View style={styles.centerContent}>
                    <Text>Không có tài liệu nào trong danh mục này</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 16,
    },
    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#e53e3e",
        marginBottom: 16,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#0a7ea4",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: "#fff",
        fontWeight: "600",
    },
    listContainer: {
        padding: 16,
    },
    columnWrapper: {
        justifyContent: "space-between",
        marginBottom: 16,
    },
});
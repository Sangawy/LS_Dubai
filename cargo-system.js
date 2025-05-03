// Global variables
let currentLanguage = 'ar';
let cargos = [];
let containerVolume = 68;
let truckCount = 5;
let currentInvoiceId = null;
let customers = [];

// Translations
const translations = {
    ar: {
        // App level
        'app-title': 'نظام إدارة البضائع',
        'current-language': 'العربية',
        
        // Navigation
        'nav-invoices': 'الفواتير',
        'nav-cargo': 'البضائع',
        'nav-dashboard': 'لوحة التحكم',
        'nav-distribution': 'التوزيع',
        
        // Invoice Section
        'invoice-section-title': 'إدارة الفواتير',
        'invoice-number-label': 'رقم الفاتورة',
        'invoice-date-label': 'التاريخ',
        'invoice-notes-label': 'الملاحظات',
        'create-invoice-btn': 'إنشاء فاتورة',
        'load-invoices-btn': 'عرض الفواتير',
        
        // Invoice List
        'invoice-list-title': 'قائمة الفواتير',
        'th-invoice-number': 'رقم الفاتورة',
        'th-invoice-date': 'التاريخ',
        'th-truck-count': 'عدد الشاحنات',
        'th-total-volume': 'إجمالي الحجم',
        'th-total-weight': 'إجمالي الوزن',
        'th-status': 'الحالة',
        'th-notes': 'الملاحظات',
        'th-actions': 'الإجراءات',
        'no-invoices': 'لا توجد فواتير',
        
        // Dashboard
        'dashboard-title': 'لوحة التحكم',
        'dashboard-current-invoice': 'الفاتورة الحالية',
        'dashboard-total-cargo': 'إجمالي البضائع',
        'dashboard-total-volume': 'إجمالي الحجم (م³)',
        'dashboard-total-weight': 'إجمالي الوزن (كجم)',
        'dashboard-remaining-volume': 'الحجم المتبقي (م³)',
        
        // Add Cargo
        'add-cargo-title': 'إضافة بضاعة',
        'full-name-label': 'اسم العميل',
        'brand-label': 'العلامة التجارية',
        'carton-number-label': 'عدد الكراتين',
        'cargo-type-label': 'نوع البضاعة',
        'weight-label': 'الوزن (كجم)',
        'volume-label': 'الحجم (م³)',
        'add-cargo-btn': 'إضافة',
        'clear-cargo-btn': 'مسح',
        
        // Cargo List
        'cargo-list-title': 'قائمة البضائع',
        'th-cargo-number': '#',
        'th-client-name': 'اسم العميل',
        'th-brand': 'العلامة التجارية',
        'th-carton-count': 'عدد الكراتين',
        'th-cargo-type': 'نوع البضاعة',
        'th-weight': 'الوزن (كجم)',
        'th-volume': 'الحجم (م³)',
        'th-cargo-actions': 'الإجراءات',
        'no-cargo': 'لا توجد بضائع',
        'export-excel': 'تصدير Excel',
        'export-pdf': 'تصدير PDF',
        
        // Distribution
        'distribution-title': 'توزيع الحجم على الشاحنات',
        'container-volume-label': 'حجم الحاوية (م³)',
        'truck-count-label': 'عدد الشاحنات',
        'update-settings-btn': 'تحديث الإعدادات',
        'distribute-btn': 'توزيع الحجم المتبقي',
        
        // Status and actions
        'active': 'نشط',
        'completed': 'مكتمل',
        'view': 'عرض',
        'edit': 'تعديل',
        'delete': 'حذف',
        'complete': 'إنهاء',
        'activate': 'تفعيل',
        'cancel': 'إلغاء',
        'confirm': 'تأكيد',
        'mobile': 'الجوال',
        'truck': 'الشاحنة',
        'apply_distribution': 'تطبيق التوزيع',
        
        // Messages and errors
        'fill_all_fields': 'يرجى ملء جميع الحقول',
        'logo_exists': 'كود الشعار موجود مسبقاً',
        'customer_added_successfully': 'تم إضافة العميل الجديد بنجاح',
        'error_adding_customer': 'خطأ في إضافة العميل',
        'invoice_number_date_required': 'يرجى إدخال رقم الفاتورة والتاريخ',
        'invoice_number_exists': 'رقم الفاتورة موجود مسبقاً',
        'invoice_created_successfully': 'تم إنشاء الفاتورة بنجاح',
        'wrong_delete_code': 'رمز الحذف غير صحيح',
        'invoice_deleted_successfully': 'تم حذف الفاتورة بنجاح',
        'select_invoice_first': 'يرجى اختيار فاتورة أولاً',
        'cannot_add_to_completed_invoice': 'لا يمكن إضافة بضاعة لفاتورة مكتملة',
        'select_brand': 'يرجى اختيار علامة تجارية',
        'no_invoice_selected': 'لم يتم اختيار فاتورة',
        'cannot_remove_from_completed_invoice': 'لا يمكن حذف بضاعة من فاتورة مكتملة',
        'cannot_edit_completed_invoice': 'لا يمكن تعديل فاتورة مكتملة',
        'no_volume_to_distribute': 'لا يوجد حجم للتوزيع',
        'no_volume_to_add': 'لا يوجد حجم للإضافة',
        'no_cargo_to_distribute': 'لا توجد بضائع للتوزيع',
        'no_cargo_to_export': 'لا توجد بضائع للتصدير',
        'remaining_volume_added': 'تم إضافة الحجم المتبقي بنجاح',
        'error_loading_customers': 'خطأ في تحميل العملاء',
        'error_creating_invoice': 'خطأ في إنشاء الفاتورة',
        'error_deleting_invoice': 'خطأ في حذف الفاتورة',
        'error_updating_invoice_status': 'خطأ في تحديث حالة الفاتورة',
        'error_loading_cargos': 'خطأ في تحميل البضائع',
        'error_adding_cargo': 'خطأ في إضافة البضاعة',
        'error_removing_cargo': 'خطأ في حذف البضاعة',
        'error_updating_cargo': 'خطأ في تحديث البضاعة',
        'error_exporting_excel': 'خطأ في تصدير Excel',
        'error_updating_volumes': 'خطأ في تحديث الحجم',
        'error_loading_invoices': 'خطأ في تحميل الفواتير'
    },
    ku: {
        // App level
        'app-title': 'سیستەمی بەڕێوەبردنی بار',
        'current-language': 'کوردی',
        
        // Navigation
        'nav-invoices': 'فاکسەکان',
        'nav-cargo': 'بارەکان',
        'nav-dashboard': 'داشبۆرد',
        'nav-distribution': 'دابەشکردن',
        
        // Invoice Section
        'invoice-section-title': 'بەڕێوەبردنی فاکسەکان',
        'invoice-number-label': 'ژمارەی فاکس',
        'invoice-date-label': 'بەروار',
        'invoice-notes-label': 'تێبینی',
        'create-invoice-btn': 'دروستکردنی فاکس',
        'load-invoices-btn': 'پیشاندانی فاکسەکان',
        
        // Invoice List
        'invoice-list-title': 'لیستی فاکسەکان',
        'th-invoice-number': 'ژمارەی فاکس',
        'th-invoice-date': 'بەروار',
        'th-truck-count': 'کۆی تراکەکان',
        'th-total-volume': 'کۆی حەجم (م³)',
        'th-total-weight': 'کۆی وەزن (کگم)',
        'th-status': 'باری فاکس',
        'th-notes': 'تێبینی',
        'th-actions': 'کردارەکان',
        'no-invoices': 'هیچ فاکسێک نییە',
        
        // Dashboard
        'dashboard-title': 'داشبۆرد',
        'dashboard-current-invoice': 'فاکسی ئێستا',
        'dashboard-total-cargo': 'کۆی بارەکان',
        'dashboard-total-volume': 'کۆی حەجم (م³)',
        'dashboard-total-weight': 'کۆی وەزن (کگم)',
        'dashboard-remaining-volume': 'حەجمی ماوە (م³)',
        
        // Add Cargo
        'add-cargo-title': 'زیادکردنی بار',
        'full-name-label': 'ناوی سیانی',
        'brand-label': 'مارکە',
        'carton-number-label': 'ژمارەی کارتۆن',
        'cargo-type-label': 'جۆری کاڵا',
        'weight-label': 'وەزن (کگم)',
        'volume-label': 'حەجم (م³)',
        'add-cargo-btn': 'زیادکردن',
        'clear-cargo-btn': 'پاککردنەوە',
        
        // Cargo List
        'cargo-list-title': 'لیستی بارەکان',
        'th-cargo-number': '#',
        'th-client-name': 'ناوی سیانی',
        'th-brand': 'مارکە',
        'th-carton-count': 'ژ. کارتۆن',
        'th-cargo-type': 'جۆری کاڵا',
        'th-weight': 'وەزن (کگم)',
        'th-volume': 'حەجم (م³)',
        'th-cargo-actions': 'کردارەکان',
        'no-cargo': 'هیچ بارێک نییە',
        'export-excel': 'ئێکسپۆرت Excel',
        'export-pdf': 'ئێکسپۆرت PDF',
        
        // Distribution
        'distribution-title': 'دابەشکردنی حەجم بەسەر تراکەکان',
        'container-volume-label': 'حەجمی کۆنتێنەر (م³)',
        'truck-count-label': 'ژمارەی تراکەکان',
        'update-settings-btn': 'نوێکردنەوە',
        'distribute-btn': 'دابەشکردنی حەجمی ماوە',
        
        // Status and actions
        'active': 'چالاک',
        'completed': 'تەواوبوو',
        'view': 'پیشاندان',
        'edit': 'دەستکاری',
        'delete': 'سڕینەوە',
        'complete': 'تەواوکردن',
        'activate': 'چالاککردنەوە',
        'cancel': 'هەڵوەشاندنەوە',
        'confirm': 'پەسەندکردن',
        'mobile': 'مۆبایل',
        'truck': 'تراک',
        'apply_distribution': 'جێبەجێکردنی دابەشکردن',
        
        // Messages and errors
        'fill_all_fields': 'تکایە هەموو خانەکان پڕ بکەوە',
        'logo_exists': 'کۆدی لۆگۆی داخڵکراو پێشتر هەیە',
        'customer_added_successfully': 'کڕیاری نوێ بە سەرکەوتوویی زیاد کرا',
        'error_adding_customer': 'هەڵەیەک ڕوویدا لە کاتی زیادکردنی کڕیار',
        'invoice_number_date_required': 'تکایە ژمارەی فاکس و بەروار پڕ بکەوە',
        'invoice_number_exists': 'فاکسێک بە هەمان ژمارە هەیە',
        'invoice_created_successfully': 'فاکسی نوێ دروست کرا بە سەرکەوتوویی',
        'wrong_delete_code': 'کۆدی سڕینەوە هەڵەیە',
        'invoice_deleted_successfully': 'فاکس بە سەرکەوتوویی سڕایەوە',
        'select_invoice_first': 'تکایە سەرەتا فاکسێک هەڵبژێرە',
        'cannot_add_to_completed_invoice': 'ناتوانیت بار زیاد بکەیت بۆ فاکسێکی تەواوبوو',
        'select_brand': 'تکایە مارکەیەک هەڵبژێرە',
        'no_invoice_selected': 'هیچ فاکسێک هەڵنەبژێردراوە',
        'cannot_remove_from_completed_invoice': 'ناتوانیت بار بسڕیتەوە لە فاکسێکی تەواوبوو',
        'cannot_edit_completed_invoice': 'ناتوانیت فاکسی تەواوبوو دەستکاری بکەیت',
        'no_volume_to_distribute': 'هیچ حەجمێک نییە بۆ دابەشکردن',
        'no_volume_to_add': 'هیچ حەجمێک نییە بۆ زیادکردن',
        'no_cargo_to_distribute': 'هیچ بارێک نییە بۆ دابەشکردن',
        'no_cargo_to_export': 'هیچ بارێک نییە بۆ ئێکسپۆرت',
        'remaining_volume_added': 'حەجمی ماوە بە سەرکەوتوویی زیاد کرا',
        'error_loading_customers': 'هەڵەیەک ڕوویدا لە کاتی بارکردنی مشتەریەکان',
        'error_creating_invoice': 'هەڵەیەک ڕوویدا لە کاتی دروستکردنی فاکس',
        'error_deleting_invoice': 'هەڵەیەک ڕوویدا لە کاتی سڕینەوەی فاکس',
        'error_updating_invoice_status': 'هەڵەیەک ڕوویدا لە کاتی نوێکردنەوەی باری فاکس',
        'error_loading_cargos': 'هەڵەیەک ڕوویدا لە کاتی بارکردنی بارەکان',
        'error_adding_cargo': 'هەڵەیەک ڕوویدا لە کاتی زیادکردنی بار',
        'error_removing_cargo': 'هەڵەیەک ڕوویدا لە کاتی سڕینەوەی بار',
        'error_updating_cargo': 'هەڵەیەک ڕوویدا لە کاتی نوێکردنەوەی بار',
        'error_exporting_excel': 'هەڵەیەک ڕوویدا لە کاتی ئێکسپۆرتکردن بۆ Excel',
        'error_updating_volumes': 'هەڵەیەک ڕوویدا لە کاتی نوێکردنەوەی حەجم',
        'error_loading_invoices': 'هەڵەیەک ڕوویدا لە کاتی بارکردنی فاکسەکان'
    },
    fa: {
        // App level
        'app-title': 'سیستم مدیریت بار',
        'current-language': 'فارسی',
        
        // Navigation
        'nav-invoices': 'فاکتورها',
        'nav-cargo': 'بارها',
        'nav-dashboard': 'داشبورد',
        'nav-distribution': 'توزیع',
        
        // Invoice Section
        'invoice-section-title': 'مدیریت فاکتورها',
        'invoice-number-label': 'شماره فاکتور',
        'invoice-date-label': 'تاریخ',
        'invoice-notes-label': 'یادداشت‌ها',
        'create-invoice-btn': 'ایجاد فاکتور',
        'load-invoices-btn': 'نمایش فاکتورها',
        
        // Invoice List
        'invoice-list-title': 'لیست فاکتورها',
        'th-invoice-number': 'شماره فاکتور',
        'th-invoice-date': 'تاریخ',
        'th-truck-count': 'تعداد کامیون‌ها',
        'th-total-volume': 'کل حجم (م³)',
        'th-total-weight': 'کل وزن (کیلوگرم)',
        'th-status': 'وضعیت',
        'th-notes': 'یادداشت‌ها',
        'th-actions': 'عملیات',
        'no-invoices': 'هیچ فاکتوری نیست',
        
        // Dashboard
        'dashboard-title': 'داشبورد',
        'dashboard-current-invoice': 'فاکتور فعلی',
        'dashboard-total-cargo': 'کل بارها',
        'dashboard-total-volume': 'کل حجم (م³)',
        'dashboard-total-weight': 'کل وزن (کیلوگرم)',
        'dashboard-remaining-volume': 'حجم باقیمانده (م³)',
        
        // Add Cargo
        'add-cargo-title': 'افزودن بار',
        'full-name-label': 'نام مشتری',
        'brand-label': 'برند',
        'carton-number-label': 'تعداد کارتن',
        'cargo-type-label': 'نوع کالا',
        'weight-label': 'وزن (کیلوگرم)',
        'volume-label': 'حجم (م³)',
        'add-cargo-btn': 'افزودن',
        'clear-cargo-btn': 'پاک کردن',
        
        // Cargo List
        'cargo-list-title': 'لیست بارها',
        'th-cargo-number': '#',
        'th-client-name': 'نام مشتری',
        'th-brand': 'برند',
        'th-carton-count': 'تعداد کارتن',
        'th-cargo-type': 'نوع کالا',
        'th-weight': 'وزن (کیلوگرم)',
        'th-volume': 'حجم (م³)',
        'th-cargo-actions': 'عملیات',
        'no-cargo': 'هیچ باری نیست',
        'export-excel': 'صادرات Excel',
        'export-pdf': 'صادرات PDF',
        
        // Distribution
        'distribution-title': 'توزیع حجم بین کامیون‌ها',
        'container-volume-label': 'حجم ظرف (م³)',
        'truck-count-label': 'تعداد کامیون‌ها',
        'update-settings-btn': 'بروزرسانی تنظیمات',
        'distribute-btn': 'توزیع حجم باقیمانده',
        
        // Status and actions
        'active': 'فعال',
        'completed': 'تکمیل شده',
        'view': 'مشاهده',
        'edit': 'ویرایش',
        'delete': 'حذف',
        'complete': 'تکمیل',
        'activate': 'فعال کردن',
        'cancel': 'انصراف',
        'confirm': 'تأیید',
        'mobile': 'موبایل',
        'truck': 'کامیون',
        'apply_distribution': 'اعمال توزیع',
        
        // Messages and errors
        'fill_all_fields': 'لطفاً تمام فیلدها را پر کنید',
        'logo_exists': 'کد لوگو قبلاً وجود دارد',
        'customer_added_successfully': 'مشتری جدید با موفقیت افزوده شد',
        'error_adding_customer': 'خطا در افزودن مشتری',
        'invoice_number_date_required': 'لطفاً شماره فاکتور و تاریخ را وارد کنید',
        'invoice_number_exists': 'شماره فاکتور قبلاً وجود دارد',
        'invoice_created_successfully': 'فاکتور جدید با موفقیت ایجاد شد',
        'wrong_delete_code': 'کد حذف اشتباه است',
        'invoice_deleted_successfully': 'فاکتور با موفقیت حذف شد',
        'select_invoice_first': 'لطفاً ابتدا یک فاکتور انتخاب کنید',
        'cannot_add_to_completed_invoice': 'نمی‌توانید به فاکتور تکمیل شده بار اضافه کنید',
        'select_brand': 'لطفاً یک برند انتخاب کنید',
        'no_invoice_selected': 'هیچ فاکتوری انتخاب نشده',
        'cannot_remove_from_completed_invoice': 'نمی‌توانید از فاکتور تکمیل شده بار حذف کنید',
        'cannot_edit_completed_invoice': 'نمی‌توانید فاکتور تکمیل شده را ویرایش کنید',
        'no_volume_to_distribute': 'هیچ حجمی برای توزیع ندارید',
        'no_volume_to_add': 'هیچ حجمی برای افزودن ندارید',
        'no_cargo_to_distribute': 'هیچ باری برای توزیع ندارید',
        'no_cargo_to_export': 'هیچ باری برای صادرات ندارید',
        'remaining_volume_added': 'حجم باقیمانده با موفقیت افزوده شد',
        'error_loading_customers': 'خطا در بارگذاری مشتریان',
        'error_creating_invoice': 'خطا در ایجاد فاکتور',
        'error_deleting_invoice': 'خطا در حذف فاکتور',
        'error_updating_invoice_status': 'خطا در بروزرسانی وضعیت فاکتور',
        'error_loading_cargos': 'خطا در بارگذاری بارها',
        'error_adding_cargo': 'خطا در افزودن بار',
        'error_removing_cargo': 'خطا در حذف بار',
        'error_updating_cargo': 'خطا در بروزرسانی بار',
        'error_exporting_excel': 'خطا در صادرات Excel',
        'error_updating_volumes': 'خطا در بروزرسانی حجم',
        'error_loading_invoices': 'خطا در بارگذاری فاکتورها'
    },
    en: {
        // App level
        'app-title': 'Cargo Management System',
        'current-language': 'English',
        
        // Navigation
        'nav-invoices': 'Invoices',
        'nav-cargo': 'Cargo',
        'nav-dashboard': 'Dashboard',
        'nav-distribution': 'Distribution',
        
        // Invoice Section
        'invoice-section-title': 'Invoice Management',
        'invoice-number-label': 'Invoice Number',
        'invoice-date-label': 'Date',
        'invoice-notes-label': 'Notes',
        'create-invoice-btn': 'Create Invoice',
        'load-invoices-btn': 'Load Invoices',
        
        // Invoice List
        'invoice-list-title': 'Invoice List',
        'th-invoice-number': 'Invoice Number',
        'th-invoice-date': 'Date',
        'th-truck-count': 'Truck Count',
        'th-total-volume': 'Total Volume (m³)',
        'th-total-weight': 'Total Weight (kg)',
        'th-status': 'Status',
        'th-notes': 'Notes',
        'th-actions': 'Actions',
        'no-invoices': 'No invoices',
        
        // Dashboard
        'dashboard-title': 'Dashboard',
        'dashboard-current-invoice': 'Current Invoice',
        'dashboard-total-cargo': 'Total Cargo',
        'dashboard-total-volume': 'Total Volume (m³)',
        'dashboard-total-weight': 'Total Weight (kg)',
        'dashboard-remaining-volume': 'Remaining Volume (m³)',
        
        // Add Cargo
        'add-cargo-title': 'Add Cargo',
        'full-name-label': 'Client Name',
        'brand-label': 'Brand',
        'carton-number-label': 'Carton Count',
        'cargo-type-label': 'Cargo Type',
        'weight-label': 'Weight (kg)',
        'volume-label': 'Volume (m³)',
        'add-cargo-btn': 'Add',
        'clear-cargo-btn': 'Clear',
        
        // Cargo List
        'cargo-list-title': 'Cargo List',
        'th-cargo-number': '#',
        'th-client-name': 'Client Name',
        'th-brand': 'Brand',
        'th-carton-count': 'Carton Count',
        'th-cargo-type': 'Cargo Type',
        'th-weight': 'Weight (kg)',
        'th-volume': 'Volume (m³)',
        'th-cargo-actions': 'Actions',
        'no-cargo': 'No cargo',
        'export-excel': 'Export Excel',
        'export-pdf': 'Export PDF',
        
        // Distribution
        'distribution-title': 'Volume Distribution Among Trucks',
        'container-volume-label': 'Container Volume (m³)',
        'truck-count-label': 'Truck Count',
        'update-settings-btn': 'Update Settings',
        'distribute-btn': 'Distribute Remaining Volume',
        
        // Status and actions
        'active': 'Active',
        'completed': 'Completed',
        'view': 'View',
        'edit': 'Edit',
        'delete': 'Delete',
        'complete': 'Complete',
        'activate': 'Activate',
        'cancel': 'Cancel',
        'confirm': 'Confirm',
        'mobile': 'Mobile',
        'truck': 'Truck',
        'apply_distribution': 'Apply Distribution',
        
        // Messages and errors
        'fill_all_fields': 'Please fill all fields',
        'logo_exists': 'Logo code already exists',
        'customer_added_successfully': 'New customer added successfully',
        'error_adding_customer': 'Error adding customer',
        'invoice_number_date_required': 'Please enter invoice number and date',
        'invoice_number_exists': 'Invoice number already exists',
        'invoice_created_successfully': 'Invoice created successfully',
        'wrong_delete_code': 'Incorrect delete code',
        'invoice_deleted_successfully': 'Invoice deleted successfully',
        'select_invoice_first': 'Please select an invoice first',
        'cannot_add_to_completed_invoice': 'Cannot add cargo to a completed invoice',
        'select_brand': 'Please select a brand',
        'no_invoice_selected': 'No invoice selected',
        'cannot_remove_from_completed_invoice': 'Cannot remove cargo from a completed invoice',
        'cannot_edit_completed_invoice': 'Cannot edit a completed invoice',
        'no_volume_to_distribute': 'No volume to distribute',
        'no_volume_to_add': 'No volume to add',
        'no_cargo_to_distribute': 'No cargo to distribute',
        'no_cargo_to_export': 'No cargo to export',
        'remaining_volume_added': 'Remaining volume successfully added',
        'error_loading_customers': 'Error loading customers',
        'error_creating_invoice': 'Error creating invoice',
        'error_deleting_invoice': 'Error deleting invoice',
        'error_updating_invoice_status': 'Error updating invoice status',
        'error_loading_cargos': 'Error loading cargo',
        'error_adding_cargo': 'Error adding cargo',
        'error_removing_cargo': 'Error removing cargo',
        'error_updating_cargo': 'Error updating cargo',
        'error_exporting_excel': 'Error exporting to Excel',
        'error_updating_volumes': 'Error updating volumes',
        'error_loading_invoices': 'Error loading invoices'
    }
};

// Language change function
function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Set document direction
    document.documentElement.dir = (lang === 'en') ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;
    
    // Set body language and direction
    document.body.dir = (lang === 'en') ? 'ltr' : 'rtl';
    
    // Font family based on language
    let fontFamily = '';
    switch(lang) {
        case 'ar':
            fontFamily = "'Noto Sans Arabic', sans-serif";
            break;
        case 'ku':
            fontFamily = "'Amiri', sans-serif";
            break;
        case 'fa':
            fontFamily = "'Noto Sans Arabic', sans-serif";
            break;
        case 'en':
            fontFamily = "'Noto Sans', sans-serif";
            break;
    }
    document.body.style.fontFamily = fontFamily;
    
    // Update all translatable elements
    for (const [key, value] of Object.entries(translations[lang])) {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = value;
        }
    }
    
    // Update the current language display in dropdown
    document.getElementById('current-language').textContent = translations[lang]['current-language'];
    
    // Update company names based on language
    updateCompanyNames(lang);
    
    // Reload invoices and cargos to update their content
    loadInvoices();
    if (currentInvoiceId) {
        updateCargoTable();
        updateDashboard();
    }
}

// Function to update company names based on language
function updateCompanyNames(lang) {
    const arName = document.querySelector('.company-name-ar');
    const enName = document.querySelector('.company-name-en');
    
    switch(lang) {
        case 'ar':
            arName.textContent = 'جبل الطور للتجارة العامة ش.ذ.م-م';
            enName.style.display = 'block';
            break;
        case 'ku':
            arName.textContent = 'جبل الطور للتجارة العامة ش.ذ.م-م';
            enName.style.display = 'block';
            break;
        case 'fa':
            arName.textContent = 'جبل الطور للتجارة العامة ش.ذ.م-م';
            enName.style.display = 'block';
            break;
        case 'en':
            arName.textContent = 'Jabal Al Toor general trading L.L.C';
            enName.style.display = 'none';
            break;
    }
}
// Get translation function
function getTranslation(key) {
    return translations[currentLanguage][key] || key;
}


document.addEventListener('DOMContentLoaded', function() {
    // Set default language to Arabic
    changeLanguage('ar');
    
    // ... rest of your code
});
// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyC2539t0L3Zms_jd7Z_qzJrzSV2dU_viS4",
    authDomain: "persson-database.firebaseapp.com",
    projectId: "persson-database",
    storageBucket: "persson-database.firebasestorage.app",
    messagingSenderId: "1002896345987",
    appId: "1:1002896345987:web:4bb12ac4c5d13fba0c44b6",
    measurementId: "G-5PC29H4823"
};

// Initialize Firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get translation
function getTranslation(key) {
    return translations[currentLanguage][key] || key;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Set default language to Arabic
    changeLanguage('ar');
    
    // Form submissions
    document.getElementById('cargo-form').addEventListener('submit', addCargo);
    document.getElementById('edit-cargo-form').addEventListener('submit', updateCargo);
    document.getElementById('create-invoice-btn').addEventListener('click', createInvoice);
    document.getElementById('load-invoices-btn').addEventListener('click', loadInvoices);
    document.getElementById('add-brand-form').addEventListener('submit', addNewBrand);
    
    // Set today's date as default
    document.getElementById('invoice-date').valueAsDate = new Date();
    
    // Load customers for brand select
    loadCustomers();
    
    // Load invoices automatically when page loads
    loadInvoices();
    
    // Bottom navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const target = this.getAttribute('data-target');
            
            // Scroll to section
            let targetElement;
            switch(target) {
                case 'invoice-section':
                    targetElement = document.querySelector('.card');
                    break;
                case 'cargo-section':
                    targetElement = document.getElementById('cargo-section-container');
                    break;
                case 'dashboard-section':
                    targetElement = document.getElementById('current-invoice-dashboard');
                    break;
                case 'distribution-section':
                    targetElement = document.getElementById('distribution-section');
                    break;
            }
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const activeNavLink = document.querySelector('.nav-link.active');
            const allNavLinks = document.querySelectorAll('.nav-link');
            const activeIndex = Array.from(allNavLinks).indexOf(activeNavLink);
            
            if (diff > 0 && activeIndex < allNavLinks.length - 1) {
                // Swipe left - next
                allNavLinks[activeIndex + 1].click();
            } else if (diff < 0 && activeIndex > 0) {
                // Swipe right - previous
                allNavLinks[activeIndex - 1].click();
            }
        }
    }
    // Export to Excel with invoice design
function exportToExcel() {
    if (cargos.length === 0) {
        alert(getTranslation('no_cargo_to_export'));
        return;
    }
    
    // Get mobile numbers
    const uniqueBrands = [...new Set(cargos.map(cargo => cargo.brand))];
    const brandMobiles = {};
    
    const fetchPromises = uniqueBrands.map(brandCode => {
        const customer = customers.find(c => c.logo === brandCode);
        if (customer && customer.id) {
            return db.collection('persons')
                .doc(customer.id)
                .get()
                .then(doc => {
                    if (doc.exists && doc.data().Mobil) {
                        brandMobiles[brandCode] = doc.data().Mobil;
                    } else {
                        brandMobiles[brandCode] = "";
                    }
                })
                .catch(error => {
                    console.error("Error getting mobile for brand:", brandCode, error);
                    brandMobiles[brandCode] = "";
                });
        } else {
            brandMobiles[brandCode] = "";
            return Promise.resolve();
        }
    });
    
    Promise.all(fetchPromises)
        .then(() => {
            // Get invoice info
            if (currentInvoiceId) {
                return db.collection('invoices').doc(currentInvoiceId).get();
            }
            return Promise.resolve(null);
        })
        .then(invoiceDoc => {
            let invoiceNumber = currentInvoiceId ? document.getElementById('current-invoice').textContent : "";
            let invoiceDate = "";
            let invoiceNotes = "";
            
            if (invoiceDoc && invoiceDoc.exists) {
                const invoice = invoiceDoc.data();
                invoiceDate = invoice.date || "";
                invoiceNotes = invoice.notes || "";
            }
            
            // Calculate totals
            const totalVolume = cargos.reduce((sum, cargo) => sum + cargo.volume, 0);
            const totalWeight = cargos.reduce((sum, cargo) => sum + cargo.weight, 0);
            const remainingVolume = containerVolume - totalVolume;
            
            // Create workbook
            const wb = XLSX.utils.book_new();
            
            // Prepare data
            const data = cargos.map((cargo, index) => {
                let displayBrand = cargo.brand;
                if (cargo.brandName) {
                    displayBrand = cargo.brandName;
                } else {
                    const customer = customers.find(c => c.logo === cargo.brand);
                    if (customer) {
                        displayBrand = customer.name;
                    }
                }
                
                return [
                    index + 1,
                    displayBrand,
                    brandMobiles[cargo.brand] || "",
                    cargo.cartonNumber,
                    cargo.type,
                    cargo.weight.toFixed(2),
                    cargo.volume.toFixed(2)
                ];
            });
            
            // Create worksheet
            const ws = {};
            
            // Add header - Company names and title
            const headerRows = [
                ['', '', '', '', '', '', '', `फक्स: ${invoiceNumber}`],
                ['جبل الطور للتجارة العامة ش.ذ.م-م'],
                ['Jabal Al Toor general trading L.L.C'],
                ['لیستی بارەکان - کۆمپانیای گواستنەوە'],
                [`بەرواری ئێکسپۆرت: ${new Date().toLocaleDateString()}`],
                [],
                [`ژمارەی فاکس: ${invoiceNumber}`],
                [`بەرواری فاکس: ${invoiceDate}`],
                [],
                [`کۆی بارەکان: ${cargos.length}`],
                [`کۆی وەزن (کگم): ${totalWeight.toFixed(2)}`],
                [`کۆی حەجم (م³): ${totalVolume.toFixed(2)}`],
                [`حەجمی ماوە: ${remainingVolume.toFixed(2)} م³`],
                [],
                ['#', 'مارکە', 'مۆبایل', 'د.کارتۆن', 'جۆری کاڵا', 'وزن (کگم)', 'حەجم (م³)']
            ];
            
            // Add data rows
            const allRows = headerRows.concat(data);
            
            // Add footer
            allRows.push([]);
            allRows.push(['', '', 'جبل الطور للتجارة العامة ش.ذ.م-م']);
            allRows.push(['', '', 'Jabal Al Toor general trading L.L.C']);
            
            // Convert to sheet
            const range = { s: { c: 0, r: 0 }, e: { c: 6, r: allRows.length - 1 } };
            const sheet = XLSX.utils.aoa_to_sheet(allRows);
            sheet['!ref'] = XLSX.utils.encode_range(range);
            
            // Merge cells for header
            sheet['!merges'] = [
                { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Company name AR
                { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }, // Company name EN
                { s: { r: 3, c: 0 }, e: { r: 3, c: 6 } }, // Title
            ];
            
            // Set column widths
            sheet['!cols'] = [
                { wch: 5 },   // #
                { wch: 20 },  // Brand
                { wch: 15 },  // Mobile
                { wch: 12 },  // Carton
                { wch: 25 },  // Type
                { wch: 12 },  // Weight
                { wch: 12 }   // Volume
            ];
            
            // Style the sheet
            for (let row in sheet) {
                if (sheet.hasOwnProperty(row) && row[0] !== '!') {
                    let cell = sheet[row];
                    cell.s = cell.s || {};
                    
                    // Center align all cells
                    cell.s.alignment = { horizontal: "center", vertical: "center" };
                    
                    // Header styling
                    if (row.includes('1') || row.includes('2') || row.includes('3')) {
                        cell.s.font = { bold: true, sz: 16 };
                        cell.s.alignment = { horizontal: "center", vertical: "center" };
                    }
                    
                    // Table header styling
                    if (row.includes('14')) {
                        cell.s.font = { bold: true, color: { rgb: "FFFFFF" } };
                        cell.s.fill = { fgColor: { rgb: "3498DB" } };
                    }
                }
            }
            
            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, sheet, `فاکس ${invoiceNumber}`);
            
            // Set workbook direction
            wb.Workbook = wb.Workbook || {};
            wb.Workbook.Views = wb.Workbook.Views || [];
            wb.Workbook.Views[0] = wb.Workbook.Views[0] || {};
            wb.Workbook.Views[0].RTL = true;
            
            // Save the file
            XLSX.writeFile(wb, `فاکس_${invoiceNumber}_${new Date().toISOString().split('T')[0]}.xlsx`);
        })
        .catch(error => {
            console.error("Error preparing Excel export:", error);
            alert(getTranslation('error_exporting_excel') + ': ' + error.message);
        });
}

// Export to PDF with invoice design
function exportToPDF() {
    if (cargos.length === 0) {
        alert(getTranslation('no_cargo_to_export'));
        return;
    }
    
    // Get mobile numbers and invoice data
    const uniqueBrands = [...new Set(cargos.map(cargo => cargo.brand))];
    const brandMobiles = {};
    
    const fetchPromises = uniqueBrands.map(brandCode => {
        const customer = customers.find(c => c.logo === brandCode);
        if (customer && customer.id) {
            return db.collection('persons')
                .doc(customer.id)
                .get()
                .then(doc => {
                    if (doc.exists && doc.data().Mobil) {
                        brandMobiles[brandCode] = doc.data().Mobil;
                    } else {
                        brandMobiles[brandCode] = "";
                    }
                })
                .catch(error => {
                    console.error("Error getting mobile for brand:", brandCode, error);
                    brandMobiles[brandCode] = "";
                });
        } else {
            brandMobiles[brandCode] = "";
            return Promise.resolve();
        }
    });
    
    Promise.all(fetchPromises)
        .then(() => {
            // Get invoice info
            if (currentInvoiceId) {
                return db.collection('invoices').doc(currentInvoiceId).get();
            }
            return Promise.resolve(null);
        })
        .then(invoiceDoc => {
            let invoiceNumber = currentInvoiceId ? document.getElementById('current-invoice').textContent : "";
            let invoiceDate = "";
            let invoiceNotes = "";
            
            if (invoiceDoc && invoiceDoc.exists) {
                const invoice = invoiceDoc.data();
                invoiceDate = invoice.date || "";
                invoiceNotes = invoice.notes || "";
            }
            
            // Calculate totals
            const totalVolume = cargos.reduce((sum, cargo) => sum + cargo.volume, 0);
            const totalWeight = cargos.reduce((sum, cargo) => sum + cargo.weight, 0);
            const remainingVolume = containerVolume - totalVolume;
            
            // Create PDF
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('تکایە ڕێگەپێدان بدە بە پۆپ-ئەپ ویندۆ');
                return;
            }
            
            const date = new Date();
            const dateTime = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <title>فاکس ${invoiceNumber}</title>
                    <style>
                        @page {
                            size: landscape;
                            margin: 0.5in;
                        }
                        
                        body {
                            font-family: Arial, Tahoma, sans-serif;
                            direction: rtl;
                            padding: 10px;
                            margin: 0;
                        }
                        
                        .invoice-header {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 20px;
                            align-items: center;
                        }
                        
                        .date-time {
                            text-align: center;
                            margin-bottom: 20px;
                            font-weight: bold;
                        }
                        
                        .company-info {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        
                        .company-name-ar {
                            font-size: 24px;
                            font-weight: bold;
                            margin-bottom: 5px;
                        }
                        
                        .company-name-en {
                            font-size: 16px;
                            margin-bottom: 5px;
                        }
                        
                        .invoice-title {
                            font-size: 20px;
                            font-weight: bold;
                            margin-bottom: 5px;
                        }
                        
                        .invoice-details {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 20px;
                            text-align: center;
                        }
                        
                        .summary {
                            display: flex;
                            justify-content: space-evenly;
                            margin-bottom: 20px;
                        }
                        
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        
                        th, td {
                            border: 1px solid #000;
                            padding: 8px;
                            text-align: center;
                        }
                        
                        th {
                            background-color: #eee;
                            font-weight: bold;
                        }
                        
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-weight: bold;
                        }
                        
                        @media print {
                            body {
                                -webkit-print-color-adjust: exact;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-header">
                        <div>${dateTime}</div>
                        <div>فكس: ${invoiceNumber}</div>
                    </div>
                    
                    <div class="company-info">
                        <h1 class="company-name-ar">جبل الطور للتجارة العامة ش.ذ.م-م</h1>
                        <h2 class="company-name-en">Jabal Al Toor general trading L.L.C</h2>
                        <h3 class="invoice-title">لیستی بارەکان - کۆمپانیای گواستنەوە</h3>
                        <p>بەرواری ئێکسپۆرت: ${date.toLocaleDateString()}</p>
                    </div>
                    
                    <div class="invoice-details">
                        <div>ژمارەی فاکس: ${invoiceNumber}</div>
                        <div>بەرواری فاکس: ${invoiceDate}</div>
                    </div>
                    
                    <div class="summary">
                        <div>کۆی بارەکان: ${cargos.length}</div>
                        <div>کۆی تراکەکان: ${truckCount}</div>
                        <div>کۆی حەجم: ${totalVolume.toFixed(2)} م³</div>
                        <div>حەجمی ماوە: ${remainingVolume.toFixed(2)} م³</div>
                        <div>کۆی وەزن: ${totalWeight.toFixed(2)} کگم</div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ژمی سیانی</th>
                                <th>مارکە</th>
                                <th>مۆبایل</th>
                                <th>ژ.کارتۆن</th>
                                <th>جۆری کاڵا</th>
                                <th>وەزن (کگم)</th>
                                <th>حەجم (م³)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cargos.map((cargo, index) => {
                                let displayBrand = cargo.brand;
                                if (cargo.brandName) {
                                    displayBrand = cargo.brandName;
                                } else {
                                    const customer = customers.find(c => c.logo === cargo.brand);
                                    if (customer) {
                                        displayBrand = customer.name;
                                    }
                                }
                                
                                const mobileNumber = brandMobiles[cargo.brand] || "";
                                
                                return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${cargo.name}</td>
                                    <td>${displayBrand}</td>
                                    <td>${mobileNumber}</td>
                                    <td>${cargo.cartonNumber}</td>
                                    <td>${cargo.type}</td>
                                    <td>${cargo.weight.toFixed(2)}</td>
                                    <td>${cargo.volume.toFixed(2)}</td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        <p>جبل الطور للتجارة العامة ش.ذ.م-م</p>
                        <p>Jabal Al Toor general trading L.L.C</p>
                    </div>
                    
                    <script>
                        setTimeout(function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 500);
                        }, 1000);
                    </script>
                </body>
                </html>
            `);
            
            printWindow.document.close();
        })
        .catch(error => {
            console.error("Error preparing PDF export:", error);
            alert('هەڵەیەک ڕوویدا لە کاتی ئێکسپۆرتکردن بۆ PDF: ' + error.message);
        });
}




});
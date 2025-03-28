// Code snippets database
const codeSnippets = {
    html: {
        title: "Responsive Navigation Bar",
        description: "A modern, responsive navigation bar with mobile menu support.",
        code: `<nav class="navbar">
    <div class="logo">Logo</div>
    <div class="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
    </div>
    <div class="hamburger">
        <span></span>
        <span></span>
        <span></span>
    </div>
</nav>`
    },
    css: {
        title: "Modern Card Design",
        description: "A beautiful card design with hover effects and shadows.",
        code: `.card {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}`
    },
    python: {
        title: "File Processing Example",
        description: "A Python script to process and analyze text files.",
        code: `def process_file(filename):
    try:
        with open(filename, 'r') as file:
            content = file.read()
            words = content.split()
            word_count = len(words)
            return word_count
    except FileNotFoundError:
        return "File not found"
    except Exception as e:
        return f"Error: {str(e)}"`
    },
    javascript: {
        title: "Form Validation",
        description: "JavaScript form validation with custom error messages.",
        code: `function validateForm(form) {
    const email = form.email.value;
    const password = form.password.value;
    let isValid = true;

    if (!email.includes('@')) {
        showError('email', 'Please enter a valid email');
        isValid = false;
    }

    if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    return isValid;
}`
    },
    java: {
        title: "String Manipulation",
        description: "Java methods for common string operations.",
        code: `public class StringUtils {
    public static String reverse(String str) {
        StringBuilder sb = new StringBuilder(str);
        return sb.reverse().toString();
    }

    public static boolean isPalindrome(String str) {
        String cleanStr = str.toLowerCase().replaceAll("[^a-z0-9]", "");
        return cleanStr.equals(reverse(cleanStr));
    }
}`
    },
    c: {
        title: "Linked List Implementation",
        description: "Basic linked list implementation in C.",
        code: `struct Node {
    int data;
    struct Node* next;
};

struct Node* createNode(int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

void insertNode(struct Node** head, int data) {
    struct Node* newNode = createNode(data);
    newNode->next = *head;
    *head = newNode;
}`
    },
    cpp: {
        title: "Class Template Example",
        description: "C++ template class for a generic stack implementation.",
        code: `template <typename T>
class Stack {
private:
    std::vector<T> elements;
public:
    void push(T value) {
        elements.push_back(value);
    }
    
    T pop() {
        if (!elements.empty()) {
            T value = elements.back();
            elements.pop_back();
            return value;
        }
        throw std::runtime_error("Stack is empty");
    }
};`
    },
    csharp: {
        title: "Async File Operations",
        description: "C# async file reading and writing operations.",
        code: `public class FileHandler {
    public async Task<string> ReadFileAsync(string path) {
        try {
            return await File.ReadAllTextAsync(path);
        }
        catch (Exception ex) {
            throw new Exception($"Error reading file: {ex.Message}");
        }
    }

    public async Task WriteFileAsync(string path, string content) {
        try {
            await File.WriteAllTextAsync(path, content);
        }
        catch (Exception ex) {
            throw new Exception($"Error writing file: {ex.Message}");
        }
    }
}`
    }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Modal functionality
    const modal = document.getElementById('codeModal');
    const categoryCards = document.querySelectorAll('.category-card');
    const closeBtn = document.querySelector('.close');
    const categoryInput = document.getElementById('codeCategory');

    if (categoryCards && modal && closeBtn && categoryInput) {
        // Add click event to each category card
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                const categoryTitle = card.querySelector('h3').textContent;
                document.getElementById('modalTitle').textContent = `Request ${categoryTitle} Code`;
                categoryInput.value = category;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal when clicking the close button
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Form submission handling
    const downloadForm = document.getElementById('downloadForm');
    if (downloadForm) {
        downloadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(downloadForm);
                const email = formData.get('email');
                const codeTitle = formData.get('codeTitle');
                const category = formData.get('category');
                const requirements = Array.from(document.querySelectorAll('input[name="requirements"]:checked'))
                    .map(checkbox => checkbox.value);
                
                // Format the message to include all details
                const formattedMessage = `
Code Request from: ${email}

Category: ${category}
Title: ${codeTitle}

Description:
${formData.get('message')}

Additional Requirements:
${requirements.length > 0 ? requirements.join(', ') : 'None specified'}
                `;
                
                formData.set('message', formattedMessage);
                
                const response = await fetch(downloadForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Thank you for your request! We will create your code and send it to your email.');
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                    downloadForm.reset();
                } else {
                    throw new Error('Failed to submit request');
                }
            } catch (error) {
                console.error('Error details:', error);
                alert('There was an error submitting your request. Please try again.');
            }
        });
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(contactForm);
                const name = formData.get('name');
                const email = formData.get('email');
                
                // Format the message to include sender's details
                const formattedMessage = `
Contact Form Submission from: ${email}
Name: ${name}

Message:
${formData.get('message')}
                `;
                
                formData.set('message', formattedMessage);
                
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Thank you for your message! We will get back to you soon.');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error details:', error);
                alert('There was an error sending your message. Please try again.');
            }
        });
    }

    // Scroll animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (navLinks && hamburger) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
}); 